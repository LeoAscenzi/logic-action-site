# Production Deployment Guide

## Architecture

```
Namecheap DNS
  www.ivybridgesociety.com       → Vercel (logic-action-site)
  dashboard.ivybridgesociety.com → Vercel (logic-action-dashboard)
  api.ivybridgesociety.com       → EC2 (nginx → api:8000)
  metabase.ivybridgesociety.com  → EC2 (nginx → metabase:3000)
  @  ivybridgesociety.com        → Vercel (redirects to www)
```

---

## Step 1 — Namecheap DNS

Go to Namecheap → Domain List → ivybridgesociety.com → Manage → Advanced DNS.

| Type  | Host        | Value                  |
|-------|-------------|------------------------|
| A     | `@`         | `76.76.21.21`          |
| CNAME | `www`       | `cname.vercel-dns.com` |
| CNAME | `dashboard` | `cname.vercel-dns.com` |
| A     | `api`       | `<EC2 public IP>`      |
| A     | `metabase`  | `<EC2 public IP>`      |

Set TTL to 300 while setting up. Raise to 3600 after everything is verified.

---

## Step 2 — EC2 Security Group

AWS Console → EC2 → Security Groups → your group → Inbound rules:

| Port | Source    | Action |
|------|-----------|--------|
| 22   | your IP   | keep   |
| 80   | 0.0.0.0/0 | **add** |
| 443  | 0.0.0.0/0 | **add** |
| 8000 | 0.0.0.0/0 | **remove** |
| 8001 | 0.0.0.0/0 | **remove** |

---

## Step 3 — Vercel Custom Domains

### logic-action-site project
1. Vercel → Project → Settings → Domains
2. Add `www.ivybridgesociety.com`
3. Add `ivybridgesociety.com` → Vercel auto-configures a redirect to `www`

### logic-action-dashboard project
1. Add `dashboard.ivybridgesociety.com`

---

## Step 4 — S3 Bucket (one-time)

1. AWS Console → S3 → Create bucket `ivybridge-uploads` in `us-east-2`
2. Uncheck "Block all public access"
3. Add bucket policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::ivybridge-uploads/uploads/*"
  }]
}
```
4. IAM → Users → Create user `ivybridge-api` → attach policy `AmazonS3FullAccess` (or bucket-scoped)
5. Create access key → save Key ID + Secret for Step 6

---

## Step 5 — Vercel Environment Variables

**logic-action-site** (Production environment):
```
BACKEND_URL=https://api.ivybridgesociety.com
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.ivybridgesociety.com
```

**logic-action-dashboard** (Production environment):
```
BACKEND_URL=https://api.ivybridgesociety.com
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_SITE_URL=https://www.ivybridgesociety.com
```

Trigger a redeploy of both projects after adding `NEXT_PUBLIC_*` vars (baked at build time).

---

## Step 6 — EC2: Create `backend/.env`

SSH into EC2 and create `/home/ec2-user/logic-action-site/backend/.env`:

```bash
DATABASE_URL=postgresql+asyncpg://<user>:<password>@<rds-endpoint>:5432/logicaction?ssl=require

SECRET_KEY=<output of: openssl rand -hex 32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30

ENVIRONMENT=prod
ALLOWED_ORIGINS=https://www.ivybridgesociety.com,https://dashboard.ivybridgesociety.com
COOKIE_DOMAIN=.ivybridgesociety.com

EMAIL_USERNAME=ivybridgesocietyadmin@gmail.com
EMAIL_PASSWORD=<gmail app password>
EMAIL_FROM=ivybridgesocietyadmin@gmail.com
SITE_URL=https://www.ivybridgesociety.com

STORAGE_BACKEND=s3
S3_BUCKET=ivybridge-uploads
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=<from Step 4>
AWS_SECRET_ACCESS_KEY=<from Step 4>
```

---

## Step 7 — SSL Certificates (one-time)

DNS must be propagated before running certbot (test with `dig api.ivybridgesociety.com` — should return EC2 IP).

On EC2, from the repo root:

```bash
# 1. Start nginx with the bootstrap config (HTTP only)
docker compose -f docker-compose.prod.yml run --rm \
  -v $(pwd)/nginx/nginx-bootstrap.conf:/etc/nginx/nginx.conf:ro \
  nginx nginx -g "daemon off;" &
# (or: copy nginx-bootstrap.conf over nginx.conf temporarily)

# Simpler: just start nginx directly for the acme challenge
docker run -d --name nginx-bootstrap \
  -p 80:80 \
  -v $(pwd)/nginx/nginx-bootstrap.conf:/etc/nginx/nginx.conf:ro \
  -v $(pwd)/certbot/www:/var/www/certbot:ro \
  nginx:alpine

# 2. Obtain certs
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d api.ivybridgesociety.com \
  -d metabase.ivybridgesociety.com \
  --email leo.ascenzi@gmail.com \
  --agree-tos --no-eff-email

# 3. Stop bootstrap nginx
docker stop nginx-bootstrap && docker rm nginx-bootstrap

# 4. Start everything with SSL
docker compose -f docker-compose.prod.yml up -d
```

### Auto-renew (add to crontab on EC2)
```bash
crontab -e
```
```
0 3 * * * docker compose -f /home/ec2-user/logic-action-site/docker-compose.prod.yml run --rm certbot renew --quiet && docker compose -f /home/ec2-user/logic-action-site/docker-compose.prod.yml restart nginx
```

---

## Step 8 — Build and Deploy API

### Local machine
```bash
# Build image
./build/build_api_tar.sh
# Or: docker build -t ivy-bridge-api:latest ./backend && docker save ivy-bridge-api:latest | gzip > build/targets/ivy-bridge-api-latest.tar.gz

# Ship to EC2
scp -i ~/.ssh/<key>.pem build/targets/ivy-bridge-api-latest.tar.gz ec2-user@<ec2-ip>:~/
```

### On EC2
```bash
docker load < ~/ivy-bridge-api-latest.tar.gz
docker compose -f docker-compose.prod.yml up -d
```

Migrations run automatically on API startup.

---

## Step 9 — First Admin User (one-time)

```bash
docker compose -f docker-compose.prod.yml exec api uv run python -c '
import sys
from app.core.security import hash_password
print(hash_password(sys.argv[1]))
' 'your!password'
```

Connect to RDS and insert:
```bash
psql -h <rds-endpoint> -U postgres -d logicaction
```
```sql
INSERT INTO users (username, fname, lname, email, password, role)
VALUES ('leo', 'Leo', 'Ascenzi', 'leo@email.com', '<hash>', 'admin');
```

---

## Step 10 — Metabase Setup (one-time)

1. Visit `https://metabase.ivybridgesociety.com`
2. Complete setup wizard (creates Metabase admin account — separate from the app)
3. Connect data source: PostgreSQL → RDS endpoint, port 5432, db `logicaction`, user `analyst_ro`
4. Settings → People → Invite to add analyst accounts

---

## Re-deploying (image update)

```bash
# Local
./build/build_api_tar.sh
scp -i ~/.ssh/<key>.pem build/targets/ivy-bridge-api-latest.tar.gz ec2-user@<ec2-ip>:~/

# EC2
docker load < ~/ivy-bridge-api-latest.tar.gz
docker compose -f docker-compose.prod.yml up -d --no-deps api
```

`--no-deps api` restarts only the API container, leaving nginx and Metabase running.

---

## Verification

```bash
curl https://api.ivybridgesociety.com/health
# → {"status":"ok"}

curl -I https://www.ivybridgesociety.com
# → HTTP/2 200

curl -I https://dashboard.ivybridgesociety.com
# → HTTP/2 200 or redirect

curl -I https://metabase.ivybridgesociety.com
# → HTTP/2 200 (Metabase login)
```

Then:
- Login on site → dashboard redirect works without `?token=` (cookie on shared domain)
- Upload an event image → URL starts with `https://ivybridge-uploads.s3.us-east-2.amazonaws.com/`
- Send a test invite → email link uses `https://www.ivybridgesociety.com/sign-up?invite=...`

---

## Troubleshooting

| Symptom | Check |
|---------|-------|
| `curl: SSL certificate problem` | Cert not yet obtained — rerun certbot step |
| nginx fails to start (SSL) | Certs not in `certbot/conf/live/` — run certbot first with bootstrap config |
| API 502 Bad Gateway | `docker compose logs api` — usually missing env var or DB connection issue |
| CORS error on dashboard | Verify `ALLOWED_ORIGINS` has both `https://www.ivybridgesociety.com` and `https://dashboard.ivybridgesociety.com` |
| Cookie not set on dashboard | Verify `COOKIE_DOMAIN=.ivybridgesociety.com` in `backend/.env` |
| S3 upload fails | Verify `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` and bucket policy |
| Metabase not loading | `docker compose logs metabase` — can take 60-90s on first start |
