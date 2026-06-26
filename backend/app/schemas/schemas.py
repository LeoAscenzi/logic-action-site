from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

from app.models.models import ExamType, UserRole


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
    token_type: str = "bearer"


# Users
class UserOut(BaseModel):
    id: int
    username: str
    fname: str
    lname: str
    email: str
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


# Exams
class ExamCreate(BaseModel):
    student_id: int
    class_id: Optional[int] = None
    score: float
    max_score: float
    type: ExamType
    exam_date: date


class ExamUpdate(BaseModel):
    score: float


class ExamOut(BaseModel):
    id: int
    student_id: int
    class_id: Optional[int]
    score: float
    max_score: float
    type: ExamType
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

    model_config = {"from_attributes": True}


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


# Attendance
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
