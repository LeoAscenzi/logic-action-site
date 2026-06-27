"""add teacher role, class teacher_id, homework table

Revision ID: a1b2c3d4e5f6
Revises: 3dd3b9c3aea0
Create Date: 2026-06-27

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "3dd3b9c3aea0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ALTER TYPE cannot run inside a transaction in older PostgreSQL versions
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'teacher'")

    op.add_column(
        "classes",
        sa.Column("teacher_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
    )

    op.create_table(
        "homework",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("students.id"), nullable=False),
        sa.Column("class_id", sa.Integer(), sa.ForeignKey("classes.id"), nullable=False),
        sa.Column("title", sa.String(length=256), nullable=True),
        sa.Column("score", sa.Numeric(6, 2), nullable=False),
        sa.Column("max_score", sa.Numeric(6, 2), nullable=False),
        sa.Column("due_date", sa.Date(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("homework")
    op.drop_column("classes", "teacher_id")
    # Note: PostgreSQL does not support removing enum values; downgrade leaves 'teacher' in userrole
