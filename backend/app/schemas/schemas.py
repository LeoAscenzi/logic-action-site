from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

from app.models.models import GradeType, UserRole


# Auth
class LoginRequest(BaseModel):
    username: str
    password: str


class ParentRegister(BaseModel):
    username: str
    fname: str
    lname: str
    email: str
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

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    fname: Optional[str] = None
    lname: Optional[str] = None


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


# Events
class EventCreate(BaseModel):
    title: str
    event_date: date
    location: Optional[str] = None
    description: Optional[str] = None
    current_capacity: Optional[int] = None


class EventUpdate(BaseModel):
    title: Optional[str] = None
    event_date: Optional[date] = None
    location: Optional[str] = None
    description: Optional[str] = None
    current_capacity: Optional[int] = None


class EventOut(BaseModel):
    id: int
    title: str
    event_date: date
    location: Optional[str]
    description: Optional[str]
    current_capacity: Optional[int]

    model_config = {"from_attributes": True}
