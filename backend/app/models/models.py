import enum
from datetime import date, datetime

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
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UserRole(str, enum.Enum):
    admin = "admin"
    parent = "parent"


class ExamType(str, enum.Enum):
    SAT = "SAT"
    SSAT = "SSAT"
    AP = "AP"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    fname: Mapped[str] = mapped_column(String(64), nullable=False)
    lname: Mapped[str] = mapped_column(String(64), nullable=False)
    email: Mapped[str] = mapped_column(String(256), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(256), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False)

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


class Class(Base):
    __tablename__ = "classes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    class_name: Mapped[str] = mapped_column(String(128), nullable=False)
    total_sessions: Mapped[int] = mapped_column(Integer, nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)

    sessions: Mapped[list["ClassSession"]] = relationship(back_populates="class_")
    exams: Mapped[list["Exam"]] = relationship(back_populates="class_")


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
    score: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    max_score: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    type: Mapped[ExamType] = mapped_column(Enum(ExamType), nullable=False)
    exam_date: Mapped[date] = mapped_column(Date, nullable=False)

    student: Mapped["Student"] = relationship(back_populates="exams")
    class_: Mapped["Class | None"] = relationship(back_populates="exams")


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
