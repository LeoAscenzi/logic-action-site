from fastapi import APIRouter, Depends

from app.models.models import User
from app.routers.deps import require_parent
from app.schemas.schemas import AttendanceOut, ClassOut, ExamOut, StudentOut
from app.services.class_service import ClassService
from app.services.exam_service import ExamService
from app.services.student_service import StudentService

router = APIRouter(prefix="/parent", tags=["parent"])


@router.get("/students", response_model=list[StudentOut])
async def view_students(
    user: User = Depends(require_parent),
    svc: StudentService = Depends(StudentService),
):
    return await svc.get_students_for_parent(user.id)


@router.get("/grades/{student_id}", response_model=list[ExamOut])
async def view_grades(
    student_id: int,
    user: User = Depends(require_parent),
    student_svc: StudentService = Depends(StudentService),
    exam_svc: ExamService = Depends(ExamService),
):
    await student_svc.assert_owned_by_parent(student_id, user.id)
    return await exam_svc.get_grades_for_student(student_id)


@router.get("/classes", response_model=list[ClassOut])
async def view_classes(
    _: User = Depends(require_parent),
    svc: ClassService = Depends(ClassService),
):
    return await svc.get_all_classes()


@router.get("/class-progress/{class_id}/{student_id}", response_model=list[AttendanceOut])
async def view_class_progress(
    class_id: int,
    student_id: int,
    user: User = Depends(require_parent),
    student_svc: StudentService = Depends(StudentService),
    class_svc: ClassService = Depends(ClassService),
):
    await student_svc.assert_owned_by_parent(student_id, user.id)
    return await class_svc.get_class_progress(class_id, student_id)
