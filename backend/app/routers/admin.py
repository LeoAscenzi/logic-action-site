from fastapi import APIRouter, Depends, status

from sqlalchemy import select

from app.db.session import get_db
from app.models.models import User, UserRole
from app.routers.deps import require_admin
from app.schemas.schemas import (
    AttendanceImport,
    AttendanceOut,
    ClassCreate,
    ClassOut,
    ExamCreate,
    ExamOut,
    ExamUpdate,
    SessionCreate,
    SessionOut,
    StudentAssign,
    StudentCreate,
    StudentOut,
    UserOut,
)
from app.services.class_service import ClassService
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
