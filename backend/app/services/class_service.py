from fastapi import Depends, HTTPException, status
from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.models import Class, ClassAttendance, ClassSession, Exam
from app.schemas.schemas import AttendanceImport, ClassCreate, ClassUpdate, SessionCreate
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
