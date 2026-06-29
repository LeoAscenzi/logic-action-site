from fastapi import Depends, HTTPException, status
from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.models import Class, ClassAttendance, ClassEnrollment, ClassSession, Exam, Homework, Student, User, UserRole
from app.schemas.schemas import AttendanceCreate, AttendanceImport, AttendanceUpdate, ClassCreate, ClassEnrollmentCreate, ClassUpdate, SessionCreate
from app.services.base import BaseService


class ClassService(BaseService):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(db)

    async def create_class(self, body: ClassCreate) -> Class:
        class_ = Class(**body.model_dump())
        self.db.add(class_)
        await self.db.commit()
        await self.db.refresh(class_)
        return class_

    async def update_class(self, class_id: int, body: ClassUpdate) -> Class:
        class_ = await self._get_class_or_422(class_id)
        updates = body.model_dump(exclude_unset=True)
        if "teacher_id" in updates and updates["teacher_id"] is not None:
            result = await self.db.execute(
                select(User).where(User.id == updates["teacher_id"], User.role == UserRole.teacher)
            )
            if not result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"User {updates['teacher_id']} is not a teacher",
                )
        for field, value in updates.items():
            setattr(class_, field, value)
        await self.db.commit()
        await self.db.refresh(class_)
        return class_

    async def delete_class(self, class_id: int) -> None:
        await self._get_class_or_422(class_id)

        result = await self.db.execute(
            select(ClassSession.id).where(ClassSession.class_id == class_id)
        )
        session_ids = list(result.scalars().all())

        if session_ids:
            await self.db.execute(
                delete(ClassAttendance).where(ClassAttendance.class_session_id.in_(session_ids))
            )
            await self.db.execute(
                delete(ClassSession).where(ClassSession.class_id == class_id)
            )

        await self.db.execute(delete(Homework).where(Homework.class_id == class_id))
        await self.db.execute(
            update(Exam).where(Exam.class_id == class_id).values(class_id=None)
        )
        await self.db.execute(delete(Class).where(Class.id == class_id))
        await self.db.commit()

    async def delete_classes(self, ids: list[int]) -> None:
        result = await self.db.execute(select(Class).where(Class.id.in_(ids)))
        found_ids = {c.id for c in result.scalars().all()}
        missing = [i for i in ids if i not in found_ids]
        if missing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Classes not found: {missing}",
            )

        result = await self.db.execute(
            select(ClassSession.id).where(ClassSession.class_id.in_(ids))
        )
        session_ids = list(result.scalars().all())

        if session_ids:
            await self.db.execute(
                delete(ClassAttendance).where(ClassAttendance.class_session_id.in_(session_ids))
            )
            await self.db.execute(
                delete(ClassSession).where(ClassSession.class_id.in_(ids))
            )

        await self.db.execute(delete(Homework).where(Homework.class_id.in_(ids)))
        await self.db.execute(
            update(Exam).where(Exam.class_id.in_(ids)).values(class_id=None)
        )
        await self.db.execute(delete(Class).where(Class.id.in_(ids)))
        await self.db.commit()

    async def create_session(self, body: SessionCreate) -> ClassSession:
        await self._get_class_or_422(body.class_id)
        session = ClassSession(**body.model_dump())
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def import_sessions(self, body: AttendanceImport) -> list[ClassAttendance]:
        await self._get_class_session_or_422(body.class_session_id)
        for record in body.records:
            await self._get_active_student_or_422(record.student_id)
        records = [
            ClassAttendance(class_session_id=body.class_session_id, **r.model_dump())
            for r in body.records
        ]
        self.db.add_all(records)
        await self.db.commit()
        for r in records:
            await self.db.refresh(r)
        return records

    async def get_all_classes(self) -> list[Class]:
        result = await self.db.execute(select(Class))
        return list(result.scalars().all())

    async def get_sessions_for_class(self, class_id: int) -> list[ClassSession]:
        await self._get_class_or_422(class_id)
        result = await self.db.execute(
            select(ClassSession)
            .where(ClassSession.class_id == class_id)
            .order_by(ClassSession.class_date)
        )
        return list(result.scalars().all())

    async def delete_session(self, session_id: int) -> None:
        result = await self.db.execute(
            select(ClassSession).where(ClassSession.id == session_id)
        )
        session = result.scalar_one_or_none()
        if not session:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
        await self.db.execute(
            delete(ClassAttendance).where(ClassAttendance.class_session_id == session_id)
        )
        await self.db.delete(session)
        await self.db.commit()

    async def get_enrolled_students(self, class_id: int) -> list[Student]:
        await self._get_class_or_422(class_id)
        result = await self.db.execute(
            select(Student)
            .join(ClassEnrollment, ClassEnrollment.student_id == Student.id)
            .where(ClassEnrollment.class_id == class_id, Student.is_deleted == False)  # noqa: E712
        )
        return list(result.scalars().all())

    async def enroll_student(self, class_id: int, body: ClassEnrollmentCreate) -> ClassEnrollment:
        await self._get_class_or_422(class_id)
        await self._get_active_student_or_422(body.student_id)
        existing = await self.db.execute(
            select(ClassEnrollment).where(
                ClassEnrollment.class_id == class_id,
                ClassEnrollment.student_id == body.student_id,
            )
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Student already enrolled in this class",
            )
        enrollment = ClassEnrollment(class_id=class_id, student_id=body.student_id)
        self.db.add(enrollment)
        await self.db.commit()
        await self.db.refresh(enrollment)
        return enrollment

    async def unenroll_student(self, class_id: int, student_id: int) -> None:
        result = await self.db.execute(
            select(ClassEnrollment).where(
                ClassEnrollment.class_id == class_id,
                ClassEnrollment.student_id == student_id,
            )
        )
        enrollment = result.scalar_one_or_none()
        if not enrollment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enrollment not found")
        await self.db.delete(enrollment)
        await self.db.commit()

    async def get_session_attendance(self, session_id: int) -> list[ClassAttendance]:
        await self._get_class_session_or_422(session_id)
        result = await self.db.execute(
            select(ClassAttendance).where(ClassAttendance.class_session_id == session_id)
        )
        return list(result.scalars().all())

    async def create_attendance(self, session_id: int, body: AttendanceCreate) -> ClassAttendance:
        await self._get_class_session_or_422(session_id)
        await self._get_active_student_or_422(body.student_id)
        existing = await self.db.execute(
            select(ClassAttendance).where(
                ClassAttendance.class_session_id == session_id,
                ClassAttendance.student_id == body.student_id,
            )
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Attendance record already exists for this student in this session",
            )
        record = ClassAttendance(class_session_id=session_id, **body.model_dump())
        self.db.add(record)
        await self.db.commit()
        await self.db.refresh(record)
        return record

    async def update_attendance(self, attendance_id: int, body: AttendanceUpdate) -> ClassAttendance:
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

    async def delete_attendance(self, attendance_id: int) -> None:
        result = await self.db.execute(
            select(ClassAttendance).where(ClassAttendance.id == attendance_id)
        )
        record = result.scalar_one_or_none()
        if not record:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found")
        await self.db.delete(record)
        await self.db.commit()

    async def get_class_progress(
        self, class_id: int, student_id: int
    ) -> list[ClassAttendance]:
        result = await self.db.execute(
            select(ClassAttendance)
            .join(ClassSession, ClassSession.id == ClassAttendance.class_session_id)
            .where(
                ClassSession.class_id == class_id,
                ClassAttendance.student_id == student_id,
            )
        )
        return list(result.scalars().all())
