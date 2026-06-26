from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.models import Exam
from app.schemas.schemas import ExamCreate, ExamUpdate
from app.services.base import BaseService


class ExamService(BaseService):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(db)

    async def add_grade(self, body: ExamCreate) -> Exam:
        await self._get_active_student_or_422(body.student_id)
        if body.class_id is not None:
            await self._get_class_or_422(body.class_id)
        if body.score > body.max_score:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="score cannot exceed max_score",
            )
        exam = Exam(**body.model_dump())
        self.db.add(exam)
        await self.db.commit()
        await self.db.refresh(exam)
        return exam

    async def update_grade(self, exam_id: int, body: ExamUpdate) -> Exam:
        exam = await self._get_exam_or_404(exam_id)
        if body.score > float(exam.max_score):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="score cannot exceed max_score",
            )
        exam.score = body.score
        await self.db.commit()
        await self.db.refresh(exam)
        return exam

    async def import_grades(self, body: list[ExamCreate]) -> list[Exam]:
        for item in body:
            await self._get_active_student_or_422(item.student_id)
            if item.class_id is not None:
                await self._get_class_or_422(item.class_id)
            if item.score > item.max_score:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"score exceeds max_score for student_id={item.student_id}",
                )
        exams = [Exam(**e.model_dump()) for e in body]
        self.db.add_all(exams)
        await self.db.commit()
        for exam in exams:
            await self.db.refresh(exam)
        return exams

    async def get_grades_for_student(self, student_id: int) -> list[Exam]:
        result = await self.db.execute(
            select(Exam).where(Exam.student_id == student_id)
        )
        return list(result.scalars().all())

    async def _get_exam_or_404(self, exam_id: int) -> Exam:
        result = await self.db.execute(select(Exam).where(Exam.id == exam_id))
        exam = result.scalar_one_or_none()
        if not exam:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam not found",
            )
        return exam
