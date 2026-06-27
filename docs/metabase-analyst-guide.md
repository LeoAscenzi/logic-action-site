# Metabase Analyst Guide

Metabase is a free, open-source BI tool that lets you write SQL queries and build dashboards on top of the Logic Action database. This guide covers local setup, connecting to production via SSH tunnel, and how to start writing queries.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- The project repo cloned (for local DB access)
- SSH key with access to the EC2 instance (for production)

---

## Step 1 — Start Metabase

### Option A: Add to the project Docker stack (recommended if you have the repo)

Add the following service to `docker-compose.yml` in the repo root:

```yaml
metabase:
  image: metabase/metabase:latest
  ports:
    - "3001:3000"
  environment:
    MB_DB_TYPE: h2   # Metabase's own internal config DB; fine for local use
  depends_on:
    - db
```

Then start everything:
```bash
./build/all_up.sh
```

Metabase will be available at **http://localhost:3001**.

### Option B: Run Metabase standalone (no repo needed)

```bash
docker run -d -p 3001:3000 --name metabase metabase/metabase
```

Then open **http://localhost:3001**.

---

## Step 2 — First-Time Setup Wizard

When you first open Metabase, it runs a setup wizard:

1. **Language** — select your preference
2. **Create your account** — use your name and a password you'll remember
3. **Add your data** — this is where you connect to the database (see Step 3 below)
4. **Usage data** — opt out if preferred, then finish

---

## Step 3 — Connect to the Database

### Local (dev database)

When Metabase is running inside the same Docker Compose stack as the `db` service, use the internal Docker network hostname:

| Field    | Value       |
|----------|-------------|
| Database type | PostgreSQL |
| Display name  | Logic Action (Local) |
| Host     | db          |
| Port     | 5432        |
| Database | logicaction |
| Username | analyst_ro  |
| Password | (provided by admin) |
| SSL      | off         |

> If you ran Metabase standalone (Option B above), use `host.docker.internal` instead of `db` as the host — `localhost` inside Docker refers to the container itself, not your machine.

### Production (AWS RDS via SSH Tunnel)

**1. Open the SSH tunnel** in a terminal and keep it running:

```bash
ssh -N -L 5433:[RDS_ENDPOINT]:5432 [EC2_USER]@[EC2_PUBLIC_IP]
```

Replace:
- `[RDS_ENDPOINT]` — RDS hostname from the AWS console
- `[EC2_USER]` — `ec2-user` (Amazon Linux) or `ubuntu` (Ubuntu)
- `[EC2_PUBLIC_IP]` — the EC2 instance's public IP or DNS

**2. Add a new database connection in Metabase** (Settings → Admin → Databases → Add database):

| Field    | Value         |
|----------|---------------|
| Database type | PostgreSQL |
| Display name  | Logic Action (Production) |
| Host     | host.docker.internal |
| Port     | **5433**      |
| Database | logicaction   |
| Username | analyst_ro    |
| Password | (provided by admin) |
| SSL      | Required      |

> **Why `host.docker.internal` and not `localhost`?**
> Metabase runs inside Docker. Inside a Docker container, `localhost` points to the container itself — not your laptop. `host.docker.internal` is a special Docker DNS name that resolves to your machine's actual IP, where the SSH tunnel is listening on port 5433.
>
> On Linux, if `host.docker.internal` doesn't resolve, use `172.17.0.1` instead (the Docker bridge gateway IP).

Click **Save** — Metabase will test the connection.

---

## Step 4 — Writing SQL Queries

Metabase has two ways to query data:

- **Question builder** — visual, point-and-click (good for quick filters/groupings)
- **Native query (SQL)** — write raw SQL, full control

For SQL practice, use the native editor:

1. Click **+ New → SQL query** in the top nav
2. Select your database from the dropdown (top right of the editor)
3. Write your query in the editor

```sql
-- Example: SAT score improvements by student
SELECT
  s.fname || ' ' || s.lname AS student,
  e.exam_type,
  MIN(e.score)              AS initial_score,
  MAX(e.score)              AS latest_score,
  MAX(e.score) - MIN(e.score) AS improvement
FROM exams e
JOIN students s ON s.id = e.student_id
WHERE e.exam_type = 'SAT'
GROUP BY s.id, s.fname, s.lname, e.exam_type
HAVING COUNT(*) > 1
ORDER BY improvement DESC;
```

4. Press **⌘ + Enter** (Mac) or **Ctrl + Enter** (Windows) to run
5. Click **Save** to name the query — saved queries are called **Questions**

---

## Step 5 — Building a Dashboard

1. Click **+ New → Dashboard**
2. Give it a name (e.g. "Student Performance Overview")
3. Click **Add a question** and select any saved Question
4. Drag to resize and reposition cards on the canvas
5. Click **Save**

You can add multiple Questions to one dashboard and apply **dashboard filters** to let viewers slice by date, student, program, etc. without editing the SQL.

---

## Tips for SQL Practice

- Use `\d tablename` in psql to inspect column names and types — or browse the **Data Model** in Metabase (Admin → Data Model) to see all tables and columns with descriptions
- The `analyst_ro` user is read-only — `INSERT`, `UPDATE`, and `DELETE` will be rejected, which is intentional
- Use **CTEs** (`WITH ... AS (...)`) to keep complex queries readable — Metabase renders them fine
- Save intermediate queries as Questions so you can reference them or add them to multiple dashboards
- Metabase supports **variables** in SQL using `{{variable_name}}` syntax, which become interactive filters on dashboards:

```sql
SELECT *
FROM exams
WHERE exam_type = {{exam_type}}
  AND score >= {{min_score}}
```

---

## Security Rules

- ❌ Do not connect Metabase to the `postgres` superuser — always use `analyst_ro`
- ❌ Do not publish dashboards publicly unless data has been cleared of PII
- ❌ Do not leave the SSH tunnel open when not in use
