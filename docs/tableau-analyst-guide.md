# Tableau → PostgreSQL Connection Guide

This guide walks you through connecting Tableau to the Logic Action database, both locally and on the production AWS RDS instance.

---

## ⚠️ Tableau Version Requirement

**Tableau Public (the free product) cannot connect to a private database.** It only accepts file uploads (CSV, Excel) or public data sources.

To follow this guide you need one of:

| Option | Cost | Notes |
|--------|------|-------|
| Tableau Desktop | ~$70/mo | Full DB connections |
| Tableau Desktop free trial | Free (14 days) | Full DB connections |
| Tableau for Students | Free | Via [Tableau Academic Program](https://www.tableau.com/academic/students) if eligible |

If none of these apply, see [`metabase-analyst-guide.md`](./metabase-analyst-guide.md) for a free alternative.

---

## Step 1 — Install the PostgreSQL Driver

Tableau requires a separate PostgreSQL driver. Do this before opening Tableau.

**Mac:**
```bash
brew install libpq
```
Or download from [Tableau's driver download page](https://www.tableau.com/support/drivers) → select PostgreSQL.

**Windows:**
Download the PostgreSQL ODBC driver from [Tableau's driver download page](https://www.tableau.com/support/drivers) → select PostgreSQL → install the `.exe`.

Restart Tableau after installing.

---

## Step 2 — Create a Read-Only Database User (Admin — run once)

> **This step is for whoever manages the database**, not the analyst. Run it once and share only the `analyst_ro` credentials with the analyst.

Connect to the running database:
```bash
docker compose exec db psql -U postgres -d logicaction
```

Then run:
```sql
CREATE USER analyst_ro WITH PASSWORD 'choose-a-strong-password';
GRANT CONNECT ON DATABASE logicaction TO analyst_ro;
GRANT USAGE ON SCHEMA public TO analyst_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analyst_ro;

-- Covers tables created in the future too
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO analyst_ro;
```

The analyst can now read any table but cannot insert, update, or delete data.

---

## Step 3 — Local Connection

Make sure the stack is running:
```bash
./build/all_up.sh
```

PostgreSQL is exposed on `localhost:5432`.

In Tableau: **Connect → To a Server → PostgreSQL**, then enter:

| Field    | Value         |
|----------|---------------|
| Server   | localhost     |
| Port     | 5432          |
| Database | logicaction   |
| Username | analyst_ro    |
| Password | (from Step 2) |
| SSL      | Unchecked     |

Click **Sign In**. You should see all tables in the schema.

---

## Step 4 — Production Connection (AWS RDS)

The RDS instance lives inside a private VPC subnet and is **not publicly accessible**. Connect via SSH tunnel through the EC2 instance.

**1. Open the tunnel** — run this in a terminal and leave it open while using Tableau:
```bash
ssh -N -L 5433:[RDS_ENDPOINT]:5432 [EC2_USER]@[EC2_PUBLIC_IP]
```

Replace:
- `[RDS_ENDPOINT]` — the RDS hostname from the AWS console (e.g. `logicaction.xxxx.us-east-1.rds.amazonaws.com`)
- `[EC2_USER]` — typically `ec2-user` (Amazon Linux) or `ubuntu` (Ubuntu AMI)
- `[EC2_PUBLIC_IP]` — the EC2 instance's public IP or DNS

**2. Connect Tableau to the tunnel:**

| Field    | Value         |
|----------|---------------|
| Server   | localhost     |
| Port     | **5433**      |
| Database | logicaction   |
| Username | analyst_ro    |
| Password | (from Step 2) |
| SSL      | Required      |

Close the terminal when you're done — the tunnel closes with it.

**Why this is safe:**
- RDS never exposes port 5432 to the internet
- Access requires a valid SSH key to the EC2 instance
- The tunnel only exists while the terminal is open

---

## Security Rules

- ❌ Do not enable "Publicly accessible" on the RDS instance
- ❌ Do not open port 5432 in the RDS security group to `0.0.0.0/0`
- ❌ Do not share the `postgres` superuser password — always use `analyst_ro`

---

## Verify Read-Only Access

Once connected, confirm the analyst cannot modify data. Run this in Tableau's Initial SQL or any connected SQL tool:

```sql
-- This should fail with "permission denied"
DELETE FROM users WHERE 1=0;
```

If it returns a permission error, the setup is correct.
