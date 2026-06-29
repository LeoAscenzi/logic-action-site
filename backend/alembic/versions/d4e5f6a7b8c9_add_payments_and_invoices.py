"""add payments and invoices

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2026-06-28

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "d4e5f6a7b8c9"
down_revision: Union[str, None] = "c3d4e5f6a7b8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "invoices",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("student_id", sa.Integer, sa.ForeignKey("students.id"), nullable=True),
        sa.Column("due_date", sa.Date, nullable=False),
        sa.Column("status", sa.Enum("unpaid", "partial", "paid", "void", name="invoicestatus"), nullable=False, server_default="unpaid"),
        sa.Column("memo", sa.String(512), nullable=True),
        sa.Column("created_by", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "invoice_line_items",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("invoice_id", sa.Integer, sa.ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False),
        sa.Column("description", sa.String(512), nullable=False),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
    )

    op.create_table(
        "payments",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("student_id", sa.Integer, sa.ForeignKey("students.id"), nullable=True),
        sa.Column("invoice_id", sa.Integer, sa.ForeignKey("invoices.id"), nullable=True),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("method", sa.Enum("cash", "venmo", "zelle", "check", "stripe", "other", name="paymentmethod"), nullable=False),
        sa.Column("status", sa.Enum("completed", "refunded", name="paymentstatus"), nullable=False, server_default="completed"),
        sa.Column("received_at", sa.Date, nullable=False),
        sa.Column("memo", sa.String(512), nullable=True),
        sa.Column("external_reference", sa.String(256), nullable=True),
        sa.Column("created_by", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("payments")
    op.drop_table("invoice_line_items")
    op.drop_table("invoices")
    op.execute("DROP TYPE paymentstatus")
    op.execute("DROP TYPE paymentmethod")
    op.execute("DROP TYPE invoicestatus")
