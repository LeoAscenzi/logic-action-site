import enum
from datetime import date, datetime, time

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Time,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UserRole(str, enum.Enum):
    admin   = "admin"
    parent  = "parent"
    teacher = "teacher"


class GradeType(str, enum.Enum):
    homework = "homework"
    exam = "exam"


class PaymentMethod(str, enum.Enum):
    cash   = "cash"
    venmo  = "venmo"
    zelle  = "zelle"
    check  = "check"
    stripe = "stripe"
    other  = "other"


class PaymentStatus(str, enum.Enum):
    completed = "completed"
    refunded  = "refunded"


class InvoiceStatus(str, enum.Enum):
    unpaid  = "unpaid"
    partial = "partial"
    paid    = "paid"
    void    = "void"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    fname: Mapped[str] = mapped_column(String(64), nullable=False)
    lname: Mapped[str] = mapped_column(String(64), nullable=False)
    email: Mapped[str] = mapped_column(String(256), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(256), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true", nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    email_grades: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true", nullable=False)
    email_announcements: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true", nullable=False)
    email_events: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true", nullable=False)

    students: Mapped[list["Student"]] = relationship(back_populates="parent_user")
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(back_populates="user")


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    fname: Mapped[str] = mapped_column(String(64), nullable=False)
    lname: Mapped[str] = mapped_column(String(64), nullable=False)
    parent_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    parent_user: Mapped["User | None"] = relationship(back_populates="students")
    exams: Mapped[list["Exam"]] = relationship(back_populates="student")
    attendances: Mapped[list["ClassAttendance"]] = relationship(back_populates="student")
    enrollments: Mapped[list["ClassEnrollment"]] = relationship(back_populates="student")


class Class(Base):
    __tablename__ = "classes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    class_name: Mapped[str] = mapped_column(String(128), nullable=False)
    total_sessions: Mapped[int] = mapped_column(Integer, nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    teacher_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)

    teacher: Mapped["User | None"] = relationship(foreign_keys=[teacher_id])
    sessions: Mapped[list["ClassSession"]] = relationship(back_populates="class_")
    exams: Mapped[list["Exam"]] = relationship(back_populates="class_")
    homework: Mapped[list["Homework"]] = relationship(back_populates="class_")
    enrollments: Mapped[list["ClassEnrollment"]] = relationship(back_populates="class_", cascade="all, delete-orphan")


class ClassSession(Base):
    __tablename__ = "class_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    class_id: Mapped[int] = mapped_column(ForeignKey("classes.id"), nullable=False)
    class_duration: Mapped[int] = mapped_column(Integer, nullable=False)  # minutes
    class_date: Mapped[date] = mapped_column(Date, nullable=False)

    class_: Mapped["Class"] = relationship(back_populates="sessions")
    attendances: Mapped[list["ClassAttendance"]] = relationship(back_populates="session")


class ClassAttendance(Base):
    __tablename__ = "class_attendance"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    class_session_id: Mapped[int] = mapped_column(ForeignKey("class_sessions.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), nullable=False)
    participation_score: Mapped[int | None] = mapped_column(Integer, nullable=True)

    session: Mapped["ClassSession"] = relationship(back_populates="attendances")
    student: Mapped["Student"] = relationship(back_populates="attendances")


class Exam(Base):
    __tablename__ = "exams"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), nullable=False)
    class_id: Mapped[int | None] = mapped_column(ForeignKey("classes.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    score: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    max_score: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    type: Mapped[GradeType] = mapped_column(Enum(GradeType), nullable=False)
    exam_date: Mapped[date] = mapped_column(Date, nullable=False)

    student: Mapped["Student"] = relationship(back_populates="exams")
    class_: Mapped["Class | None"] = relationship(back_populates="exams")


class Homework(Base):
    __tablename__ = "homework"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), nullable=False)
    class_id: Mapped[int] = mapped_column(ForeignKey("classes.id"), nullable=False)
    title: Mapped[str | None] = mapped_column(String(256), nullable=True)
    score: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    max_score: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    student: Mapped["Student"] = relationship()
    class_: Mapped["Class"] = relationship(back_populates="homework")


class ClassEnrollment(Base):
    __tablename__ = "class_enrollments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    class_id: Mapped[int] = mapped_column(ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), nullable=False)

    class_: Mapped["Class"] = relationship(back_populates="enrollments")
    student: Mapped["Student"] = relationship(back_populates="enrollments")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    token: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    is_valid: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="refresh_tokens")


class CommunityPost(Base):
    __tablename__ = "community_posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    author: Mapped["User"] = relationship(foreign_keys=[author_id])
    comments: Mapped[list["Comment"]] = relationship(back_populates="post", cascade="all, delete-orphan")


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    post: Mapped["CommunityPost"] = relationship(back_populates="comments")
    author: Mapped["User"] = relationship(foreign_keys=[author_id])


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    event_date: Mapped[date] = mapped_column(Date, nullable=False)
    event_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    event_timezone: Mapped[str | None] = mapped_column(String(64), nullable=True)
    location: Mapped[str | None] = mapped_column(String(256), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    current_capacity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class EventRegistration(Base):
    __tablename__ = "event_registrations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(254), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    event: Mapped["Event"] = relationship()


class Invite(Base):
    __tablename__ = "invites"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    token: Mapped[str] = mapped_column(String(512), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(254), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, create_type=False), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class Invoice(Base):
    __tablename__ = "invoices"

    id:         Mapped[int]           = mapped_column(Integer, primary_key=True)
    student_id: Mapped[int | None]    = mapped_column(ForeignKey("students.id"), nullable=True)
    due_date:   Mapped[date]          = mapped_column(Date, nullable=False)
    status:     Mapped[InvoiceStatus] = mapped_column(Enum(InvoiceStatus), nullable=False, default=InvoiceStatus.unpaid)
    memo:       Mapped[str | None]    = mapped_column(String(512), nullable=True)
    created_by: Mapped[int]           = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime]      = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    student:    Mapped["Student | None"]       = relationship(foreign_keys=[student_id])
    line_items: Mapped[list["InvoiceLineItem"]] = relationship(back_populates="invoice", cascade="all, delete-orphan")
    payments:   Mapped[list["Payment"]]         = relationship(back_populates="invoice")

    @property
    def total(self) -> float:
        return round(sum(float(item.amount) for item in self.line_items), 2)

    @property
    def amount_paid(self) -> float:
        return round(sum(float(p.amount) for p in self.payments if p.status == PaymentStatus.completed), 2)


class InvoiceLineItem(Base):
    __tablename__ = "invoice_line_items"

    id:          Mapped[int]     = mapped_column(Integer, primary_key=True)
    invoice_id:  Mapped[int]     = mapped_column(ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False)
    description: Mapped[str]     = mapped_column(String(512), nullable=False)
    amount:      Mapped[float]   = mapped_column(Numeric(10, 2), nullable=False)

    invoice: Mapped["Invoice"] = relationship(back_populates="line_items")


class Payment(Base):
    __tablename__ = "payments"

    id:                 Mapped[int]           = mapped_column(Integer, primary_key=True)
    student_id:         Mapped[int | None]    = mapped_column(ForeignKey("students.id"), nullable=True)
    invoice_id:         Mapped[int | None]    = mapped_column(ForeignKey("invoices.id"), nullable=True)
    amount:             Mapped[float]         = mapped_column(Numeric(10, 2), nullable=False)
    method:             Mapped[PaymentMethod] = mapped_column(Enum(PaymentMethod), nullable=False)
    status:             Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.completed)
    received_at:        Mapped[date]          = mapped_column(Date, nullable=False)
    memo:               Mapped[str | None]    = mapped_column(String(512), nullable=True)
    external_reference: Mapped[str | None]    = mapped_column(String(256), nullable=True)
    created_by:         Mapped[int]           = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at:         Mapped[datetime]      = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    student: Mapped["Student | None"] = relationship(foreign_keys=[student_id])
    invoice: Mapped["Invoice | None"] = relationship(back_populates="payments")
