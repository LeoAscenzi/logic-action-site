from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.models import Invoice, InvoiceLineItem, InvoiceStatus, Payment, PaymentStatus, Student
from app.schemas.schemas import InvoiceCreate, InvoiceUpdate, PaymentCreate, StudentBalanceOut
from app.services.base import BaseService


class PaymentService(BaseService):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(db)

    # ── Invoice ──────────────────────────────────────────────────────────────

    async def create_invoice(self, body: InvoiceCreate, admin_id: int) -> Invoice:
        if not body.line_items:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invoice must have at least one line item",
            )
        if body.student_id is not None:
            await self._get_active_student_or_422(body.student_id)

        invoice = Invoice(
            student_id=body.student_id,
            due_date=body.due_date,
            memo=body.memo,
            created_by=admin_id,
            status=InvoiceStatus.unpaid,
        )
        self.db.add(invoice)
        await self.db.flush()  # get invoice.id before creating line items

        for item in body.line_items:
            self.db.add(InvoiceLineItem(
                invoice_id=invoice.id,
                description=item.description,
                amount=item.amount,
            ))

        await self.db.commit()
        return await self._load_invoice(invoice.id)

    async def get_invoice(self, invoice_id: int) -> Invoice:
        invoice = await self._load_invoice(invoice_id)
        if not invoice:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
        return invoice

    async def list_invoices(
        self,
        student_id: int | None = None,
        invoice_status: InvoiceStatus | None = None,
    ) -> list[Invoice]:
        q = select(Invoice).options(
            selectinload(Invoice.line_items),
            selectinload(Invoice.payments),
        )
        if student_id is not None:
            q = q.where(Invoice.student_id == student_id)
        if invoice_status is not None:
            q = q.where(Invoice.status == invoice_status)
        q = q.order_by(Invoice.created_at.desc())
        result = await self.db.execute(q)
        return list(result.scalars().all())

    async def update_invoice(self, invoice_id: int, body: InvoiceUpdate) -> Invoice:
        invoice = await self._get_invoice_or_404(invoice_id)
        if body.due_date is not None:
            invoice.due_date = body.due_date
        if body.memo is not None:
            invoice.memo = body.memo
        await self.db.commit()
        return await self._load_invoice(invoice_id)

    async def void_invoice(self, invoice_id: int) -> Invoice:
        invoice = await self._get_invoice_or_404(invoice_id)
        invoice.status = InvoiceStatus.void
        await self.db.commit()
        return await self._load_invoice(invoice_id)

    # ── Payment ───────────────────────────────────────────────────────────────

    async def record_payment(self, body: PaymentCreate, admin_id: int) -> Payment:
        if body.student_id is not None:
            await self._get_active_student_or_422(body.student_id)
        if body.invoice_id is not None:
            await self._get_invoice_or_404(body.invoice_id)

        payment = Payment(
            student_id=body.student_id,
            invoice_id=body.invoice_id,
            amount=body.amount,
            method=body.method,
            status=PaymentStatus.completed,
            received_at=body.received_at,
            memo=body.memo,
            external_reference=body.external_reference,
            created_by=admin_id,
        )
        self.db.add(payment)
        await self.db.commit()
        await self.db.refresh(payment)

        if body.invoice_id is not None:
            await self._recalculate_invoice_status(body.invoice_id)

        return payment

    async def refund_payment(self, payment_id: int) -> Payment:
        payment = await self._get_payment_or_404(payment_id)
        payment.status = PaymentStatus.refunded
        await self.db.commit()
        await self.db.refresh(payment)

        if payment.invoice_id is not None:
            await self._recalculate_invoice_status(payment.invoice_id)

        return payment

    async def list_payments(self, student_id: int | None = None) -> list[Payment]:
        q = select(Payment)
        if student_id is not None:
            q = q.where(Payment.student_id == student_id)
        q = q.order_by(Payment.received_at.desc())
        result = await self.db.execute(q)
        return list(result.scalars().all())

    # ── Balance ───────────────────────────────────────────────────────────────

    async def get_student_balance(self, student_id: int) -> StudentBalanceOut:
        student = await self._get_active_student_or_422(student_id)
        return await self._compute_balance(student)

    async def list_student_balances(self) -> list[StudentBalanceOut]:
        result = await self.db.execute(
            select(Student).where(Student.is_deleted == False)  # noqa: E712
        )
        students = list(result.scalars().all())
        balances = [await self._compute_balance(s) for s in students]
        balances.sort(key=lambda b: b.balance, reverse=True)
        return balances

    # ── Helpers ───────────────────────────────────────────────────────────────

    async def _load_invoice(self, invoice_id: int) -> Invoice | None:
        result = await self.db.execute(
            select(Invoice)
            .options(
                selectinload(Invoice.line_items),
                selectinload(Invoice.payments),
            )
            .where(Invoice.id == invoice_id)
        )
        return result.scalar_one_or_none()

    async def _get_invoice_or_404(self, invoice_id: int) -> Invoice:
        result = await self.db.execute(select(Invoice).where(Invoice.id == invoice_id))
        invoice = result.scalar_one_or_none()
        if not invoice:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
        return invoice

    async def _get_payment_or_404(self, payment_id: int) -> Payment:
        result = await self.db.execute(select(Payment).where(Payment.id == payment_id))
        payment = result.scalar_one_or_none()
        if not payment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
        return payment

    async def _recalculate_invoice_status(self, invoice_id: int) -> None:
        invoice = await self._load_invoice(invoice_id)
        if not invoice or invoice.status == InvoiceStatus.void:
            return
        total = sum(float(item.amount) for item in invoice.line_items)
        paid = sum(float(p.amount) for p in invoice.payments if p.status == PaymentStatus.completed)
        if paid == 0:
            invoice.status = InvoiceStatus.unpaid
        elif paid < total:
            invoice.status = InvoiceStatus.partial
        else:
            invoice.status = InvoiceStatus.paid
        await self.db.commit()

    async def _compute_balance(self, student: Student) -> StudentBalanceOut:
        invoices = await self.list_invoices(student_id=student.id)
        payments = await self.list_payments(student_id=student.id)

        total_invoiced = sum(
            sum(float(item.amount) for item in inv.line_items)
            for inv in invoices
            if inv.status != InvoiceStatus.void
        )
        total_paid = sum(
            float(p.amount) for p in payments if p.status == PaymentStatus.completed
        )

        return StudentBalanceOut(
            student_id=student.id,
            fname=student.fname,
            lname=student.lname,
            total_invoiced=round(total_invoiced, 2),
            total_paid=round(total_paid, 2),
            balance=round(total_invoiced - total_paid, 2),
        )
