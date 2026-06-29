from fastapi import APIRouter, Depends, HTTPException, status

from app.models.models import User
from app.routers.deps import require_teacher
from app.schemas.schemas import (
    AttendanceCreate,
    AttendanceImport,
    AttendanceOut,
    AttendanceUpdate,
    ClassOut,
    ExamCreate,
    ExamOut,
    ExamUpdate,
    HomeworkCreate,
    HomeworkOut,
    HomeworkUpdate,
    SessionOut,
    StudentOut,
)
from app.services.class_service import ClassService
from app.services.exam_service import ExamService
from app.services.homework_service import HomeworkService
from app.services.teacher_service import TeacherService

router = APIRouter(prefix="/teacher", tags=["teacher"])


# ── Classes ────────────────────────────────────────────────────────────────────

@router.get("/classes", response_model=list[ClassOut])
async def get_my_classes(
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
):
    return await svc.get_teacher_classes(teacher.id)


@router.get("/classes/{class_id}/sessions", response_model=list[SessionOut])
async def get_class_sessions(
    class_id: int,
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
):
    await svc.assert_teacher_owns_class(class_id, teacher.id)
    return await svc.get_sessions_for_class(class_id)


@router.get("/classes/{class_id}/students", response_model=list[StudentOut])
async def get_class_students(
    class_id: int,
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
):
    await svc.assert_teacher_owns_class(class_id, teacher.id)
    return await svc.get_students_in_class(class_id)


@router.get("/classes/{class_id}/grades", response_model=list[ExamOut])
async def get_class_grades(
    class_id: int,
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
):
    await svc.assert_teacher_owns_class(class_id, teacher.id)
    return await svc.get_grades_for_class(class_id)


@router.get("/students/{student_id}/shared-classes", response_model=list[ClassOut])
async def get_student_shared_classes(
    student_id: int,
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
):
    return await svc.get_student_shared_classes(student_id, teacher.id)


# ── Attendance ─────────────────────────────────────────────────────────────────

@router.get("/sessions/{session_id}/attendance", response_model=list[AttendanceOut])
async def get_session_attendance(
    session_id: int,
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
):
    await svc.assert_session_belongs_to_teacher(session_id, teacher.id)
    return await svc.get_session_attendance(session_id)


@router.post(
    "/sessions/{session_id}/attendance",
    response_model=AttendanceOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_attendance(
    session_id: int,
    body: AttendanceCreate,
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
):
    await svc.assert_session_belongs_to_teacher(session_id, teacher.id)
    return await svc.create_attendance(session_id, body)


@router.patch("/attendance/{attendance_id}", response_model=AttendanceOut)
async def update_attendance(
    attendance_id: int,
    body: AttendanceUpdate,
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
):
    await svc.assert_attendance_belongs_to_teacher(attendance_id, teacher.id)
    return await svc.update_attendance(attendance_id, body)


@router.delete("/attendance/{attendance_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_attendance(
    attendance_id: int,
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
):
    await svc.assert_attendance_belongs_to_teacher(attendance_id, teacher.id)
    await svc.delete_attendance(attendance_id)


@router.post(
    "/sessions/{session_id}/import-attendance",
    response_model=list[AttendanceOut],
    status_code=status.HTTP_201_CREATED,
)
async def import_session_attendance(
    session_id: int,
    body: AttendanceImport,
    teacher: User = Depends(require_teacher),
    teacher_svc: TeacherService = Depends(TeacherService),
    class_svc: ClassService = Depends(ClassService),
):
    await teacher_svc.assert_session_belongs_to_teacher(session_id, teacher.id)
    import_body = AttendanceImport(class_session_id=session_id, records=body.records)
    return await class_svc.import_sessions(import_body)


# ── Homework ───────────────────────────────────────────────────────────────────

@router.get("/classes/{class_id}/homework", response_model=list[HomeworkOut])
async def get_class_homework(
    class_id: int,
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
    hw_svc: HomeworkService = Depends(HomeworkService),
):
    await svc.assert_teacher_owns_class(class_id, teacher.id)
    return await hw_svc.get_homework_for_class(class_id)


@router.post("/homework", response_model=HomeworkOut, status_code=status.HTTP_201_CREATED)
async def add_homework(
    body: HomeworkCreate,
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
    hw_svc: HomeworkService = Depends(HomeworkService),
):
    await svc.assert_teacher_owns_class(body.class_id, teacher.id)
    return await hw_svc.add_homework(body)


@router.patch("/homework/{homework_id}", response_model=HomeworkOut)
async def update_homework(
    homework_id: int,
    body: HomeworkUpdate,
    teacher: User = Depends(require_teacher),
    hw_svc: HomeworkService = Depends(HomeworkService),
    svc: TeacherService = Depends(TeacherService),
):
    hw = await hw_svc._get_homework_or_404(homework_id)
    await svc.assert_teacher_owns_class(hw.class_id, teacher.id)
    return await hw_svc.update_homework(homework_id, body)


@router.delete("/homework/{homework_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_homework(
    homework_id: int,
    teacher: User = Depends(require_teacher),
    hw_svc: HomeworkService = Depends(HomeworkService),
    svc: TeacherService = Depends(TeacherService),
):
    hw = await hw_svc._get_homework_or_404(homework_id)
    await svc.assert_teacher_owns_class(hw.class_id, teacher.id)
    await hw_svc.delete_homework(homework_id)


# ── Practice Exams ─────────────────────────────────────────────────────────────

@router.post(
    "/classes/{class_id}/exams",
    response_model=ExamOut,
    status_code=status.HTTP_201_CREATED,
)
async def add_exam(
    class_id: int,
    body: ExamCreate,
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
    exam_svc: ExamService = Depends(ExamService),
):
    await svc.assert_teacher_owns_class(class_id, teacher.id)
    body_with_class = body.model_copy(update={"class_id": class_id})
    return await exam_svc.add_grade(body_with_class)


@router.patch("/exams/{exam_id}", response_model=ExamOut)
async def update_exam(
    exam_id: int,
    body: ExamUpdate,
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
    exam_svc: ExamService = Depends(ExamService),
):
    exam = await exam_svc._get_exam_or_404(exam_id)
    if exam.class_id is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Exam is not associated with a class")
    await svc.assert_teacher_owns_class(exam.class_id, teacher.id)
    return await exam_svc.update_grade(exam_id, body)


@router.delete("/exams/{exam_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_exam(
    exam_id: int,
    teacher: User = Depends(require_teacher),
    svc: TeacherService = Depends(TeacherService),
    exam_svc: ExamService = Depends(ExamService),
):
    exam = await exam_svc._get_exam_or_404(exam_id)
    if exam.class_id is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Exam is not associated with a class")
    await svc.assert_teacher_owns_class(exam.class_id, teacher.id)
    await exam_svc.db.delete(exam)
    await exam_svc.db.commit()
