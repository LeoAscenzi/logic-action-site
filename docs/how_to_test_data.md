# Test / Seed Data

The seed script lives in `build/` and is gitignored — it creates production-like data for local development and Metabase exploration.

## What gets created

| Table             | Count                                   |
|-------------------|-----------------------------------------|
| `students`        | 30                                      |
| `classes`         | 10 (mix of SAT, SSAT, AP — 2024–2026)  |
| `class_enrollments` | 50 (5 students per class, rotating)  |
| `class_sessions`  | 120 (12 bi-weekly sessions per class)   |
| `class_attendance`| 600 (all enrolled students per session) |
| `exams`           | 200 (4 per student per class, improving)|
| `homework`        | 600 (12 weekly assignments per student) |

All 10 classes are assigned to the teacher with `id = 4`. Students rotate across classes so most appear in 1–2 classes.

## Prerequisites

- Docker stack is running (`./build/all_up.sh`)
- Teacher with `id = 4` exists in the `users` table
- Migrations are up to date (`docker compose exec api uv run alembic upgrade head`)

## Run it

```bash
./build/seed_db.sh
```

Or pipe the SQL directly:

```bash
docker compose exec -T db psql -U postgres -d logicaction < build/seed_data.sql
```

You should see a summary notice at the end:

```
NOTICE:  Seed complete.
NOTICE:  Students:   30
NOTICE:  Classes:    10
...
```

## Cleaning up

The script does not have a teardown — the user asked to handle cleanup separately. When you're ready to wipe:

```bash
docker compose exec db psql -U postgres -d logicaction
```

```sql
-- Remove seed data (adjust id ranges to match what was inserted)
DELETE FROM homework        WHERE class_id IN (SELECT id FROM classes WHERE teacher_id = 4);
DELETE FROM exams           WHERE class_id IN (SELECT id FROM classes WHERE teacher_id = 4);
DELETE FROM class_attendance WHERE class_session_id IN (
  SELECT id FROM class_sessions WHERE class_id IN (SELECT id FROM classes WHERE teacher_id = 4)
);
DELETE FROM class_sessions  WHERE class_id IN (SELECT id FROM classes WHERE teacher_id = 4);
DELETE FROM class_enrollments WHERE class_id IN (SELECT id FROM classes WHERE teacher_id = 4);
DELETE FROM classes         WHERE teacher_id = 4;
-- Remove the seed students by name range if needed (manual step)
```

## Re-running

The enrollment step uses `ON CONFLICT DO NOTHING`, but all other tables will accumulate duplicate records if the script is run more than once. Run cleanup first if you need a clean slate.
