from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.models.models import Student, User, UserRole
from app.schemas.schemas import StudentCreate
from app.services.base import BaseService


class StudentService(BaseService):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(db)

    async def get_all_students(self) -> list[Student]:
        result = await self.db.execute(
            select(Student).where(Student.is_deleted == False)  # noqa: E712
        )
        return list(result.scalars().all())

    async def create_student(self, body: StudentCreate) -> Student:            
        student = Student(**body.model_dump())
        self.db.add(student)
        try:
            await self.db.commit()
        except IntegrityError as e:
            await self.db.rollback()
            raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Provided parent ID not registered, register new student without parent id"
                )
        await self.db.refresh(student)
        return student

    async def delete_student(self, student_id: int) -> None:
        result = await self.db.execute(
            select(Student).where(
                Student.id == student_id,
                Student.is_deleted == False,  # noqa: E712
            )
        )
        student = result.scalar_one_or_none()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found",
            )
        student.is_deleted = True
        await self.db.commit()

    async def get_students_for_parent(self, parent_id: int) -> list[Student]:
        result = await self.db.execute(
            select(Student).where(
                Student.parent_id == parent_id,
                Student.is_deleted == False,  # noqa: E712
            )
        )
        return list(result.scalars().all())

    async def assign_parent(self, student_id: int, parent_id: int) -> Student:
        result = await self.db.execute(
            select(Student).where(
                Student.id == student_id,
                Student.is_deleted == False,  # noqa: E712
            )
        )
        student = result.scalar_one_or_none()
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

        result = await self.db.execute(
            select(User).where(User.id == parent_id, User.role == UserRole.parent)
        )
        if not result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"User {parent_id} not found or is not a parent account",
            )

        student.parent_id = parent_id
        await self.db.commit()
        await self.db.refresh(student)
        return student

    async def assert_owned_by_parent(self, student_id: int, parent_id: int) -> None:
        result = await self.db.execute(
            select(Student).where(
                Student.id == student_id,
                Student.parent_id == parent_id,
            )
        )
        if not result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied",
            )
