from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.models import Class, ClassAttendance, ClassEnrollment, ClassSession, Exam, Student
from app.schemas.schemas import AttendanceCreate, AttendanceUpdate
from app.services.base import BaseService


class TeacherService(BaseService):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(db)

    async def get_teacher_classes(self, teacher_id: int) -> list[Class]:
        result = await self.db.execute(
            select(Class).where(Class.teacher_id == teacher_id)
        )
        return list(result.scalars().all())

    async def assert_teacher_owns_class(self, class_id: int, teacher_id: int) -> Class:
        class_ = await self._get_class_or_422(class_id)
        if class_.teacher_id != teacher_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not assigned to this class",
            )
        return class_

    async def assert_session_belongs_to_teacher(
        self, session_id: int, teacher_id: int
    ) -> ClassSession:
        session = await self._get_class_session_or_422(session_id)
        await self.assert_teacher_owns_class(session.class_id, teacher_id)
        return session

    async def assert_attendance_belongs_to_teacher(
        self, attendance_id: int, teacher_id: int
    ) -> ClassAttendance:
        result = await self.db.execute(
            select(ClassAttendance).where(ClassAttendance.id == attendance_id)
        )
        record = result.scalar_one_or_none()
        if not record:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found")
        await self.assert_session_belongs_to_teacher(record.class_session_id, teacher_id)
        return record

    async def get_sessions_for_class(self, class_id: int) -> list[ClassSession]:
        result = await self.db.execute(
            select(ClassSession)
            .where(ClassSession.class_id == class_id)
            .order_by(ClassSession.class_date)
        )
        return list(result.scalars().all())

    async def get_students_in_class(self, class_id: int) -> list[Student]:
        result = await self.db.execute(
            select(Student)
            .join(ClassEnrollment, ClassEnrollment.student_id == Student.id)
            .where(ClassEnrollment.class_id == class_id, Student.is_deleted == False)  # noqa: E712
        )
        return list(result.scalars().all())

    async def get_session_attendance(self, session_id: int) -> list[ClassAttendance]:
        result = await self.db.execute(
            select(ClassAttendance).where(ClassAttendance.class_session_id == session_id)
        )
        return list(result.scalars().all())

    async def create_attendance(
        self, session_id: int, body: AttendanceCreate
    ) -> ClassAttendance:
        await self._get_class_session_or_422(session_id)
        await self._get_active_student_or_422(body.student_id)
        result = await self.db.execute(
            select(ClassAttendance).where(
                ClassAttendance.class_session_id == session_id,
                ClassAttendance.student_id == body.student_id,
            )
        )
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Attendance record already exists for this student in this session",
            )
        record = ClassAttendance(class_session_id=session_id, **body.model_dump())
        self.db.add(record)
        await self.db.commit()
        await self.db.refresh(record)
        return record

    async def update_attendance(
        self, attendance_id: int, body: AttendanceUpdate
    ) -> ClassAttendance:
        result = await self.db.execute(
            select(ClassAttendance).where(ClassAttendance.id == attendance_id)
        )
        record = result.scalar_one_or_none()
        if not record:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found")
        if body.participation_score is not None:
            record.participation_score = body.participation_score
        await self.db.commit()
        await self.db.refresh(record)
        return record

    async def get_grades_for_class(self, class_id: int) -> list[Exam]:
        result = await self.db.execute(
            select(Exam)
            .where(Exam.class_id == class_id)
            .order_by(Exam.exam_date.desc())
        )
        return list(result.scalars().all())

    async def get_student_shared_classes(self, student_id: int, teacher_id: int) -> list[Class]:
        result = await self.db.execute(
            select(Class)
            .join(ClassEnrollment, ClassEnrollment.class_id == Class.id)
            .where(
                Class.teacher_id == teacher_id,
                ClassEnrollment.student_id == student_id,
            )
        )
        return list(result.scalars().all())

    async def delete_attendance(self, attendance_id: int) -> None:
        result = await self.db.execute(
            select(ClassAttendance).where(ClassAttendance.id == attendance_id)
        )
        record = result.scalar_one_or_none()
        if not record:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found")
        await self.db.delete(record)
        await self.db.commit()
