from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.models import Homework
from app.schemas.schemas import HomeworkCreate, HomeworkUpdate
from app.services.base import BaseService


class HomeworkService(BaseService):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(db)

    async def get_homework_for_class(self, class_id: int) -> list[Homework]:
        result = await self.db.execute(
            select(Homework).where(Homework.class_id == class_id)
        )
        return list(result.scalars().all())

    async def add_homework(self, body: HomeworkCreate) -> Homework:
        await self._get_active_student_or_422(body.student_id)
        await self._get_class_or_422(body.class_id)
        if body.score > body.max_score:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="score cannot exceed max_score",
            )
        hw = Homework(**body.model_dump())
        self.db.add(hw)
        await self.db.commit()
        await self.db.refresh(hw)
        return hw

    async def update_homework(self, homework_id: int, body: HomeworkUpdate) -> Homework:
        hw = await self._get_homework_or_404(homework_id)
        new_score = body.score if body.score is not None else float(hw.score)
        new_max   = body.max_score if body.max_score is not None else float(hw.max_score)
        if new_score > new_max:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="score cannot exceed max_score",
            )
        for field, value in body.model_dump(exclude_unset=True).items():
            setattr(hw, field, value)
        await self.db.commit()
        await self.db.refresh(hw)
        return hw

    async def delete_homework(self, homework_id: int) -> None:
        hw = await self._get_homework_or_404(homework_id)
        await self.db.delete(hw)
        await self.db.commit()

    async def _get_homework_or_404(self, homework_id: int) -> Homework:
        result = await self.db.execute(select(Homework).where(Homework.id == homework_id))
        hw = result.scalar_one_or_none()
        if not hw:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Homework not found")
        return hw
