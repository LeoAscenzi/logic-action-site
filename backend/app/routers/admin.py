from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy import select

from app.db.session import get_db
from app.core.security import hash_password
from app.models.models import User, UserRole
from app.routers.deps import require_admin
from app.schemas.schemas import (
    AttendanceCreate,
    AttendanceImport,
    AttendanceOut,
    AttendanceUpdate,
    BulkDeleteBody,
    ClassCreate,
    ClassEnrollmentCreate,
    ClassEnrollmentOut,
    ClassOut,
    ClassUpdate,
    EventCreate,
    EventOut,
    EventUpdate,
    ExamCreate,
    ExamOut,
    ExamUpdate,
    SessionCreate,
    SessionOut,
    StudentAssign,
    StudentCreate,
    StudentDetailOut,
    StudentOut,
    TeacherCreate,
    UserOut,
)
from app.services.class_service import ClassService
from app.services.event_service import EventService
from app.services.exam_service import ExamService
from app.services.student_service import StudentService
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/create-student", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
async def create_student(
    body: StudentCreate,
    _: User = Depends(require_admin),
    svc: StudentService = Depends(StudentService),
):
    return await svc.create_student(body)


@router.delete("/delete-student/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(
    student_id: int,
    _: User = Depends(require_admin),
    svc: StudentService = Depends(StudentService),
):
    await svc.delete_student(student_id)


@router.post("/add-grade", response_model=ExamOut, status_code=status.HTTP_201_CREATED)
async def add_grade(
    body: ExamCreate,
    _: User = Depends(require_admin),
    svc: ExamService = Depends(ExamService),
):
    return await svc.add_grade(body)


@router.patch("/update-grade/{exam_id}", response_model=ExamOut)
async def update_grade(
    exam_id: int,
    body: ExamUpdate,
    _: User = Depends(require_admin),
    svc: ExamService = Depends(ExamService),
):
    return await svc.update_grade(exam_id, body)


@router.post("/import-grades", response_model=list[ExamOut], status_code=status.HTTP_201_CREATED)
async def import_grades(
    body: list[ExamCreate],
    _: User = Depends(require_admin),
    svc: ExamService = Depends(ExamService),
):
    return await svc.import_grades(body)


@router.get("/parents", response_model=list[UserOut])
async def list_parents(
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.role == UserRole.parent))
    return result.scalars().all()


@router.patch("/assign-student/{student_id}", response_model=StudentOut)
async def assign_student(
    student_id: int,
    body: StudentAssign,
    _: User = Depends(require_admin),
    svc: StudentService = Depends(StudentService),
):
    return await svc.assign_parent(student_id, body.parent_id)


@router.get("/students", response_model=list[StudentOut])
async def list_students(
    _: User = Depends(require_admin),
    svc: StudentService = Depends(StudentService),
):
    return await svc.get_all_students()


@router.get("/classes", response_model=list[ClassOut])
async def list_classes(
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    return await svc.get_all_classes()


@router.post("/create-class", response_model=ClassOut, status_code=status.HTTP_201_CREATED)
async def create_class(
    body: ClassCreate,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    return await svc.create_class(body)


@router.post("/create-session", response_model=SessionOut, status_code=status.HTTP_201_CREATED)
async def create_session(
    body: SessionCreate,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    return await svc.create_session(body)


@router.post("/import-sessions", response_model=list[AttendanceOut], status_code=status.HTTP_201_CREATED)
async def import_sessions(
    body: AttendanceImport,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    return await svc.import_sessions(body)


@router.delete("/delete-students", status_code=status.HTTP_204_NO_CONTENT)
async def bulk_delete_students(
    body: BulkDeleteBody,
    _: User = Depends(require_admin),
    svc: StudentService = Depends(StudentService),
):
    await svc.delete_students(body.ids)


@router.get("/grades/{student_id}", response_model=list[ExamOut])
async def get_student_grades(
    student_id: int,
    _: User = Depends(require_admin),
    svc: ExamService = Depends(ExamService),
):
    return await svc.get_grades_for_student(student_id)


@router.patch("/update-class/{class_id}", response_model=ClassOut)
async def update_class(
    class_id: int,
    body: ClassUpdate,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    return await svc.update_class(class_id, body)


@router.delete("/delete-class/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_class(
    class_id: int,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    await svc.delete_class(class_id)


@router.delete("/delete-classes", status_code=status.HTTP_204_NO_CONTENT)
async def bulk_delete_classes(
    body: BulkDeleteBody,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    await svc.delete_classes(body.ids)


@router.post("/create-teacher", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_teacher(
    body: TeacherCreate,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(
        select(User).where((User.username == body.username) | (User.email == body.email))
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already registered",
        )
    user = User(
        username=body.username,
        fname=body.fname,
        lname=body.lname,
        email=body.email,
        password=hash_password(body.password),
        role=UserRole.teacher,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.get("/teachers", response_model=list[UserOut])
async def list_teachers(
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.role == UserRole.teacher))
    return result.scalars().all()


@router.get("/students/{student_id}", response_model=StudentDetailOut)
async def get_student_detail(
    student_id: int,
    _: User = Depends(require_admin),
    svc: StudentService = Depends(StudentService),
):
    return await svc.get_student_detail(student_id)


@router.get("/classes/{class_id}/students", response_model=list[StudentOut])
async def list_class_students(
    class_id: int,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    return await svc.get_enrolled_students(class_id)


@router.post("/classes/{class_id}/students", response_model=ClassEnrollmentOut, status_code=status.HTTP_201_CREATED)
async def enroll_student(
    class_id: int,
    body: ClassEnrollmentCreate,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    return await svc.enroll_student(class_id, body)


@router.delete("/classes/{class_id}/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unenroll_student(
    class_id: int,
    student_id: int,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    await svc.unenroll_student(class_id, student_id)


@router.get("/classes/{class_id}/sessions", response_model=list[SessionOut])
async def list_class_sessions(
    class_id: int,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    return await svc.get_sessions_for_class(class_id)


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: int,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    await svc.delete_session(session_id)


@router.get("/sessions/{session_id}/attendance", response_model=list[AttendanceOut])
async def list_session_attendance(
    session_id: int,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    return await svc.get_session_attendance(session_id)


@router.post("/sessions/{session_id}/attendance", response_model=AttendanceOut, status_code=status.HTTP_201_CREATED)
async def create_attendance(
    session_id: int,
    body: AttendanceCreate,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    return await svc.create_attendance(session_id, body)


@router.patch("/attendance/{attendance_id}", response_model=AttendanceOut)
async def update_attendance(
    attendance_id: int,
    body: AttendanceUpdate,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    return await svc.update_attendance(attendance_id, body)


@router.delete("/attendance/{attendance_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_attendance(
    attendance_id: int,
    _: User = Depends(require_admin),
    svc: ClassService = Depends(ClassService),
):
    await svc.delete_attendance(attendance_id)


@router.post("/events", response_model=EventOut, status_code=status.HTTP_201_CREATED)
async def create_event(
    body: EventCreate,
    _: User = Depends(require_admin),
    svc: EventService = Depends(EventService),
):
    return await svc.create_event(body)


@router.patch("/events/{event_id}", response_model=EventOut)
async def update_event(
    event_id: int,
    body: EventUpdate,
    _: User = Depends(require_admin),
    svc: EventService = Depends(EventService),
):
    return await svc.update_event(event_id, body)


@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event_id: int,
    _: User = Depends(require_admin),
    svc: EventService = Depends(EventService),
):
    await svc.delete_event(event_id)
