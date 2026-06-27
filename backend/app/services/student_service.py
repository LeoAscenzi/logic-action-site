from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.models.models import Class, ClassEnrollment, Exam, Student, User, UserRole
from app.schemas.schemas import StudentCreate, StudentDetailOut
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

    async def delete_students(self, ids: list[int]) -> None:
        result = await self.db.execute(
            select(Student).where(Student.id.in_(ids), Student.is_deleted == False)  # noqa: E712
        )
        found = {s.id: s for s in result.scalars().all()}
        missing = [i for i in ids if i not in found]
        if missing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Students not found: {missing}",
            )
        for student in found.values():
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

    async def get_student_detail(self, student_id: int) -> StudentDetailOut:
        student = await self._get_active_student_or_422(student_id)

        parent = None
        if student.parent_id:
            result = await self.db.execute(select(User).where(User.id == student.parent_id))
            parent = result.scalar_one_or_none()

        result = await self.db.execute(
            select(Class)
            .join(ClassEnrollment, ClassEnrollment.class_id == Class.id)
            .where(ClassEnrollment.student_id == student_id)
        )
        enrolled_classes = list(result.scalars().all())

        result = await self.db.execute(select(Exam).where(Exam.student_id == student_id))
        exam_count = len(list(result.scalars().all()))

        return StudentDetailOut(
            id=student.id,
            fname=student.fname,
            lname=student.lname,
            parent_id=student.parent_id,
            parent_fname=parent.fname if parent else None,
            parent_lname=parent.lname if parent else None,
            enrolled_classes=enrolled_classes,
            exam_count=exam_count,
        )

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
