"""replace examtype with gradetype and add title to exams

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2026-06-28

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "c3d4e5f6a7b8"
down_revision: Union[str, None] = "8c63ff7f6148"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create the new enum type
    op.execute("CREATE TYPE gradetype AS ENUM ('homework', 'exam')")

    # 2. Add title column (nullable first so existing rows pass)
    op.add_column("exams", sa.Column("title", sa.String(256), nullable=True))

    # 3. Migrate existing rows: all old SAT/SSAT/AP records become 'exam'
    op.execute(
        "ALTER TABLE exams ALTER COLUMN type TYPE gradetype USING 'exam'::gradetype"
    )

    # 4. Fill title default for existing rows and make NOT NULL
    op.execute("UPDATE exams SET title = '' WHERE title IS NULL")
    op.alter_column("exams", "title", nullable=False, server_default="")

    # 5. Drop the old enum (Postgres requires this after no more references)
    op.execute("DROP TYPE examtype")


def downgrade() -> None:
    op.execute("CREATE TYPE examtype AS ENUM ('SAT', 'SSAT', 'AP')")
    op.execute(
        "ALTER TABLE exams ALTER COLUMN type TYPE examtype USING 'SAT'::examtype"
    )
    op.drop_column("exams", "title")
    op.execute("DROP TYPE gradetype")
