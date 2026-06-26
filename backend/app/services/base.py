from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Class, ClassSession, Student


class BaseService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _get_active_student_or_422(self, student_id: int) -> Student:
        result = await self.db.execute(
            select(Student).where(
                Student.id == student_id,
                Student.is_deleted == False,  # noqa: E712
            )
        )
        student = result.scalar_one_or_none()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Student {student_id} not found or has been deleted",
            )
        return student

    async def _get_class_or_422(self, class_id: int) -> Class:
        result = await self.db.execute(select(Class).where(Class.id == class_id))
        cls = result.scalar_one_or_none()
        if not cls:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Class {class_id} not found",
            )
        return cls

    async def _get_class_session_or_422(self, session_id: int) -> ClassSession:
        result = await self.db.execute(
            select(ClassSession).where(ClassSession.id == session_id)
        )
        session = result.scalar_one_or_none()
        if not session:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"ClassSession {session_id} not found",
            )
        return session
