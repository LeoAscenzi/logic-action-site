from datetime import date, datetime, time
from typing import Optional

from pydantic import BaseModel, EmailStr

from app.models.models import GradeType, InvoiceStatus, PaymentMethod, PaymentStatus, UserRole


# Auth
class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterWithInvite(BaseModel):
    token: str
    username: str
    fname: str
    lname: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str | None = None
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str | None = None


# Users
class UserOut(BaseModel):
    id: int
    username: str
    fname: str
    lname: str
    email: str
    role: UserRole
    avatar_url: Optional[str] = None
    email_grades: bool = True
    email_announcements: bool = True
    email_events: bool = True

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    fname: Optional[str] = None
    lname: Optional[str] = None
    avatar_url: Optional[str] = None
    email_grades: Optional[bool] = None
    email_announcements: Optional[bool] = None
    email_events: Optional[bool] = None


class PublicUserOut(BaseModel):
    id: int
    fname: str
    lname: str
    role: UserRole

    model_config = {"from_attributes": True}


# Students
class StudentAssign(BaseModel):
    parent_id: int


class StudentCreate(BaseModel):
    fname: str
    lname: str
    parent_id: Optional[int] = None


class StudentOut(BaseModel):
    id: int
    fname: str
    lname: str
    parent_id: Optional[int]

    model_config = {"from_attributes": True}


# Exams / Grades
class ExamCreate(BaseModel):
    student_id: int
    class_id: Optional[int] = None
    title: str = ""
    score: float
    max_score: float
    type: GradeType
    exam_date: date


class ExamUpdate(BaseModel):
    title: Optional[str] = None
    score: Optional[float] = None
    max_score: Optional[float] = None
    type: Optional[GradeType] = None
    exam_date: Optional[date] = None


class ExamOut(BaseModel):
    id: int
    student_id: int
    class_id: Optional[int]
    title: str
    score: float
    max_score: float
    type: GradeType
    exam_date: date

    model_config = {"from_attributes": True}


# Classes
class ClassCreate(BaseModel):
    class_name: str
    total_sessions: int
    start_date: date
    end_date: date
    capacity: int


class ClassOut(BaseModel):
    id: int
    class_name: str
    total_sessions: int
    start_date: date
    end_date: date
    capacity: int
    teacher_id: Optional[int] = None

    model_config = {"from_attributes": True}


class ClassUpdate(BaseModel):
    class_name: Optional[str] = None
    total_sessions: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    capacity: Optional[int] = None
    teacher_id: Optional[int] = None


class BulkDeleteBody(BaseModel):
    ids: list[int]


# Sessions
class SessionCreate(BaseModel):
    class_id: int
    class_duration: int
    class_date: date


class SessionOut(BaseModel):
    id: int
    class_id: int
    class_duration: int
    class_date: date

    model_config = {"from_attributes": True}


# Enrollments
class ClassEnrollmentCreate(BaseModel):
    student_id: int


class ClassEnrollmentOut(BaseModel):
    id: int
    class_id: int
    student_id: int

    model_config = {"from_attributes": True}


class StudentDetailOut(BaseModel):
    id: int
    fname: str
    lname: str
    parent_id: Optional[int]
    parent_fname: Optional[str]
    parent_lname: Optional[str]
    enrolled_classes: list[ClassOut]
    exam_count: int


# Teachers
class TeacherCreate(BaseModel):
    username: str
    fname: str
    lname: str
    email: str
    password: str


# Homework
class HomeworkCreate(BaseModel):
    student_id: int
    class_id: int
    title: Optional[str] = None
    score: float
    max_score: float
    due_date: Optional[date] = None


class HomeworkUpdate(BaseModel):
    title: Optional[str] = None
    score: Optional[float] = None
    max_score: Optional[float] = None
    due_date: Optional[date] = None


class HomeworkOut(BaseModel):
    id: int
    student_id: int
    class_id: int
    title: Optional[str]
    score: float
    max_score: float
    due_date: Optional[date]

    model_config = {"from_attributes": True}


# Attendance
class AttendanceCreate(BaseModel):
    student_id: int
    participation_score: Optional[int] = None


class AttendanceUpdate(BaseModel):
    participation_score: Optional[int] = None


class AttendanceRecord(BaseModel):
    student_id: int
    participation_score: Optional[int] = None


class AttendanceImport(BaseModel):
    class_session_id: int
    records: list[AttendanceRecord]


class AttendanceOut(BaseModel):
    id: int
    class_session_id: int
    student_id: int
    participation_score: Optional[int]

    model_config = {"from_attributes": True}


# Community Posts
class CommunityPostCreate(BaseModel):
    title: str
    content: str


class CommunityPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class CommentCreate(BaseModel):
    content: str


class CommentOut(BaseModel):
    id: int
    post_id: int
    author_id: int
    author_fname: str
    author_lname: str
    author_role: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class CommunityPostOut(BaseModel):
    id: int
    author_id: int
    author_fname: str
    author_lname: str
    author_role: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    comment_count: int

    model_config = {"from_attributes": True}


class CommunityPostDetailOut(CommunityPostOut):
    comments: list[CommentOut] = []


class MyCommentOut(BaseModel):
    id: int
    post_id: int
    post_title: str
    content: str
    created_at: datetime


# Payments & Invoices
class LineItemCreate(BaseModel):
    description: str
    amount: float


class InvoiceCreate(BaseModel):
    student_id: Optional[int] = None
    due_date: date
    memo: Optional[str] = None
    line_items: list[LineItemCreate]


class InvoiceUpdate(BaseModel):
    due_date: Optional[date] = None
    memo: Optional[str] = None


class LineItemOut(BaseModel):
    id: int
    description: str
    amount: float

    model_config = {"from_attributes": True}


class InvoiceOut(BaseModel):
    id: int
    student_id: Optional[int]
    due_date: date
    status: InvoiceStatus
    memo: Optional[str]
    created_at: datetime
    line_items: list[LineItemOut]
    total: float
    amount_paid: float

    model_config = {"from_attributes": True}


class PaymentCreate(BaseModel):
    student_id: Optional[int] = None
    invoice_id: Optional[int] = None
    amount: float
    method: PaymentMethod
    received_at: date
    memo: Optional[str] = None
    external_reference: Optional[str] = None


class PaymentOut(BaseModel):
    id: int
    student_id: Optional[int]
    invoice_id: Optional[int]
    amount: float
    method: PaymentMethod
    status: PaymentStatus
    received_at: date
    memo: Optional[str]
    external_reference: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class StudentBalanceOut(BaseModel):
    student_id: int
    fname: str
    lname: str
    total_invoiced: float
    total_paid: float
    balance: float


# Events
class EventCreate(BaseModel):
    title: str
    event_date: date
    event_time: Optional[time] = None
    event_timezone: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    current_capacity: Optional[int] = None


class EventUpdate(BaseModel):
    title: Optional[str] = None
    event_date: Optional[date] = None
    event_time: Optional[time] = None
    event_timezone: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    current_capacity: Optional[int] = None


class EventOut(BaseModel):
    id: int
    title: str
    event_date: date
    event_time: Optional[time]
    event_timezone: Optional[str]
    location: Optional[str]
    description: Optional[str]
    image_url: Optional[str]
    current_capacity: Optional[int]

    model_config = {"from_attributes": True}


class UploadOut(BaseModel):
    url: str


# Event RSVPs
class EventRsvpIn(BaseModel):
    name: str
    email: EmailStr


class EventRsvpOut(BaseModel):
    id: int
    event_id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


# Invites
class InviteCreate(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.parent
    expires_days: int = 7


class InviteOut(BaseModel):
    id: int
    email: str
    role: UserRole
    expires_at: datetime
    is_used: bool

    model_config = {"from_attributes": True}


class InviteValidate(BaseModel):
    email: str
    role: UserRole
