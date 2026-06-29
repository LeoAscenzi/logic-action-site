# QA Deployment — RDS + EC2

## Prerequisites

- EC2 instance running (Amazon Linux 2 or Ubuntu)
- RDS PostgreSQL 16 instance provisioned
- SSH access to EC2
- Docker installed on EC2 (`sudo yum install docker -y && sudo systemctl start docker`)
- Security group: EC2 → RDS port 5432 allowed inbound on the RDS SG
- EC2 security group: inbound port 8000 open to the internet (see Step 0 below)

---

## Step 0 — Open EC2 port 8000 to the internet

Vercel's egress IPs are dynamic so you can't allowlist them — open port 8000 to `0.0.0.0/0`.

AWS Console → **EC2 → Security Groups** → select the security group attached to your EC2 instance → **Inbound rules → Edit inbound rules → Add rule:**

| Field | Value |
|---|---|
| Type | Custom TCP |
| Port range | 8000 |
| Source | 0.0.0.0/0 |
| Description | Vercel → API |

Save. Takes effect immediately, no instance restart needed.

Port 8000 is not a standard browser-accessible port so general exposure risk is low, but consider putting the API behind a load balancer or nginx with HTTPS before going to production.

---

## Step 1 — Generate a SECRET_KEY (one-time, save it)

On your local machine:

```bash
openssl rand -hex 32
```

Copy the output. Save it somewhere safe (1Password, AWS SSM, local notes — NOT in the repo).

---

## Step 2 — RDS: Create the `logicaction` database

RDS ships with only the database you named during instance creation (usually `postgres`). You need to create `logicaction` manually.

### Option A — Specify it at instance creation time
When creating the RDS instance in the AWS console, set **Initial database name** to `logicaction`. Done — skip the rest of this step.

### Option B — Create it after the fact
Connect from EC2 (which can reach RDS on the private network):

```bash
sudo yum install -y postgresql16
psql -h <rds-endpoint> -U postgres -d postgres -c "CREATE DATABASE logicaction;"
```

### Metabase read-only user (optional, for analytics)
While connected:

```sql
CREATE ROLE analyst_ro WITH LOGIN PASSWORD 'choose-a-strong-password';
GRANT CONNECT ON DATABASE logicaction TO analyst_ro;
GRANT USAGE ON SCHEMA public TO analyst_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analyst_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO analyst_ro;
```

---

## Step 3 — Vercel: set environment variables

In the Vercel dashboard → Project Settings → Environment Variables, add these for the **Preview** (and Production when ready) environment:

| Variable | Value |
|---|---|
| `BACKEND_URL` | `http://<ec2-public-ip>:8000` |
| `NEXT_PUBLIC_API_URL` | `/api` |

The frontend proxies all `/api/*` calls server-side to the EC2 backend, so the browser never talks directly to EC2. CORS on the backend covers direct preflight requests via a regex that matches all `logic-action-site-*.vercel.app` preview URLs automatically — no need to update `ALLOWED_ORIGINS` per deployment.

---

## Step 4 — Build and package the image

On your local machine from the project root:

```bash
./build/build_api_tar.sh
# Produces: build/targets/ivy-bridge-api-qa-latest.tar
```

---

## Step 5 — SCP the tar to EC2

```bash
scp -i ~/.ssh/<your-key>.pem \
    build/targets/ivy-bridge-api-qa-latest.tar \
    ec2-user@<ec2-public-ip>:~/
```

---

## Step 6 — Load and run the container on EC2

SSH into EC2:

```bash
ssh -i ~/.ssh/<your-key>.pem ec2-user@<ec2-public-ip>
```

Load the image:

```bash
docker load < ~/ivy-bridge-api-qa-latest.tar
```

Run the container. The entrypoint runs `alembic upgrade head` then starts uvicorn:

```bash
docker run -d \
  --name api \
  --restart unless-stopped \
  -p 8000:8000 \
  -e POSTGRES_HOST="<rds-endpoint>" \
  -e POSTGRES_PORT="5432" \
  -e POSTGRES_USER="postgres" \
  -e POSTGRES_PASSWORD='<rds-master-password>' \
  -e POSTGRES_DB="logicaction" \
  -e SECRET_KEY="<secret-key-from-step-1>" \
  -e ALLOWED_ORIGINS="http://localhost:3000" \
  -e ENVIRONMENT="qa" \
  ivy-bridge-api-qa:latest
```



Notes:
- `ENVIRONMENT=qa` → SSL appended to DB URL, secure cookies on, no `--reload`
- `ALLOWED_ORIGINS` only needs explicit origins for non-Vercel callers — all `logic-action-site-*.vercel.app` preview URLs are covered by the regex in the backend
- `COOKIE_DOMAIN` is intentionally omitted — cookies are scoped to the Vercel domain automatically via the Next.js proxy

Watch the startup logs:

```bash
docker logs -f api
```

Expected output:
```
Running migrations...
INFO  [alembic.runtime.migration] Running upgrade ... -> d4e5f6a7b8c9, add payments and invoices
Starting server...
INFO:     Application startup complete.
```

---

## Step 7 — Create the first admin user

Hash the password inside the running container. If your password contains special characters (`!`, `$`, etc.), pass it as an argument to avoid shell interpretation issues:

```bash
docker exec api uv run python -c '
import sys
from app.core.security import hash_password
print(hash_password(sys.argv[1]))
' 'your!password'
```

For plain passwords without special characters, the simpler form works too:

```bash
docker exec api uv run python -c \
  "from app.core.security import hash_password; print(hash_password('yourpassword'))"
```

Copy the hash. Connect to RDS and insert the admin user:

```bash
psql -h <rds-endpoint> -U postgres -d logicaction
```

```sql
INSERT INTO users (username, fname, lname, email, password, role)
VALUES ('leo', 'Leo', 'Ascenzi', 'leo@email.com', '<hash>', 'admin');
```

---

## Step 8 — Verify

```bash
curl http://<ec2-public-ip>:8000/health
# → {"status":"ok"}

curl http://<ec2-public-ip>:8000/me
# → 401 Unauthorized  (expected — API is up and auth is working)
```

Then open your Vercel preview URL and log in through the site.

---

## Re-deploying (image update)

```bash
# Local — rebuild and ship
./build/build_api_tar.sh
scp -i ~/.ssh/<key>.pem build/targets/ivy-bridge-api-qa-latest.tar ec2-user@<ec2-ip>:~/

# EC2 — swap the container
docker stop api && docker rm api
docker load < ~/ivy-bridge-api-qa-latest.tar
docker run -d ... (same run command as Step 6)
```

Migrations run automatically on startup — no separate step needed.

Vercel redeploys the frontend automatically on push. The API is a manual step until a CI/CD pipeline is wired up.

---

## Troubleshooting

| Symptom | Check |
|---|---|
| `ssl: SYSCALL error: EOF detected` | RDS SSL issue — verify `ENVIRONMENT` is not `dev` |
| `password authentication failed` | Wrong `POSTGRES_PASSWORD` or `POSTGRES_USER` |
| `database "logicaction" does not exist` | Run Step 2 — create the DB on RDS first |
| Frontend gets CORS error | Verify Vercel deployment URL matches `logic-action-site-*.vercel.app`; custom domains need adding to `ALLOWED_ORIGINS` |
| `Multiple head revisions` | Two migrations share the same `down_revision` — see CLAUDE.md pitfall note |
| `password authentication failed` in container | Password contains special chars (`!`, `$`, etc.) — use single quotes: `-e POSTGRES_PASSWORD='pass!word'` |
| Container exits immediately | `docker logs api` — usually a missing env var (`SECRET_KEY` required) |
| Vercel can't reach EC2 | Check EC2 security group has port 8000 open inbound (Step 0); check `BACKEND_URL` in Vercel env vars |
