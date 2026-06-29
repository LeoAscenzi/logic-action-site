from typing import Optional

from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.models import Comment, CommunityPost, User, UserRole
from app.schemas.schemas import (
	CommentCreate,
	CommentOut,
	CommunityPostCreate,
	CommunityPostDetailOut,
	CommunityPostOut,
	CommunityPostUpdate,
)
from app.services.base import BaseService


def _comment_to_out(comment: Comment) -> CommentOut:
	return CommentOut(
		id=comment.id,
		post_id=comment.post_id,
		author_id=comment.author_id,
		author_fname=comment.author.fname,
		author_lname=comment.author.lname,
		author_role=comment.author.role.value,
		content=comment.content,
		created_at=comment.created_at,
	)


def _post_to_out(post: CommunityPost) -> CommunityPostOut:
	return CommunityPostOut(
		id=post.id,
		author_id=post.author_id,
		author_fname=post.author.fname,
		author_lname=post.author.lname,
		author_role=post.author.role.value,
		title=post.title,
		content=post.content,
		created_at=post.created_at,
		updated_at=post.updated_at,
		comment_count=len(post.comments),
	)


def _post_to_detail_out(post: CommunityPost) -> CommunityPostDetailOut:
	return CommunityPostDetailOut(
		id=post.id,
		author_id=post.author_id,
		author_fname=post.author.fname,
		author_lname=post.author.lname,
		author_role=post.author.role.value,
		title=post.title,
		content=post.content,
		created_at=post.created_at,
		updated_at=post.updated_at,
		comment_count=len(post.comments),
		comments=[_comment_to_out(c) for c in post.comments],
	)


_POST_LOAD = [
	selectinload(CommunityPost.author),
	selectinload(CommunityPost.comments).selectinload(Comment.author),
]


class CommunityService(BaseService):
	def __init__(self, db: AsyncSession = Depends(get_db)):
		super().__init__(db)

	async def _get_post_or_404(self, post_id: int) -> CommunityPost:
		result = await self.db.execute(
			select(CommunityPost)
			.where(CommunityPost.id == post_id, CommunityPost.is_deleted == False)  # noqa: E712
			.options(*_POST_LOAD)
		)
		post = result.scalar_one_or_none()
		if not post:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
		return post

	def _check_ownership(self, author_id: int, user: User) -> None:
		if user.role != UserRole.admin and author_id != user.id:
			raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

	async def list_posts(self, skip: int = 0, limit: int = 10, author_id: Optional[int] = None) -> list[CommunityPostOut]:
		q = select(CommunityPost).where(CommunityPost.is_deleted == False)  # noqa: E712
		if author_id is not None:
			q = q.where(CommunityPost.author_id == author_id)
		q = q.options(*_POST_LOAD).order_by(CommunityPost.created_at.desc()).offset(skip).limit(limit)
		result = await self.db.execute(q)
		return [_post_to_out(p) for p in result.scalars().all()]

	async def list_my_posts(self, author_id: int) -> list[CommunityPostOut]:
		result = await self.db.execute(
			select(CommunityPost)
			.where(CommunityPost.is_deleted == False, CommunityPost.author_id == author_id)  # noqa: E712
			.options(*_POST_LOAD)
			.order_by(CommunityPost.created_at.desc())
		)
		return [_post_to_out(p) for p in result.scalars().all()]

	async def list_my_comments(self, author_id: int) -> list:
		result = await self.db.execute(
			select(Comment, CommunityPost.title)
			.join(CommunityPost, Comment.post_id == CommunityPost.id)
			.where(Comment.author_id == author_id, CommunityPost.is_deleted == False)  # noqa: E712
			.order_by(Comment.created_at.desc())
		)
		return [
			{"id": c.id, "post_id": c.post_id, "post_title": title, "content": c.content, "created_at": c.created_at}
			for c, title in result.all()
		]

	async def get_post(self, post_id: int) -> CommunityPostDetailOut:
		post = await self._get_post_or_404(post_id)
		return _post_to_detail_out(post)

	async def create_post(self, body: CommunityPostCreate, user: User) -> CommunityPostOut:
		post = CommunityPost(author_id=user.id, title=body.title, content=body.content)
		self.db.add(post)
		await self.db.commit()
		await self.db.refresh(post)
		result = await self.db.execute(
			select(CommunityPost).where(CommunityPost.id == post.id).options(*_POST_LOAD)
		)
		return _post_to_out(result.scalar_one())

	async def update_post(self, post_id: int, body: CommunityPostUpdate, user: User) -> CommunityPostOut:
		post = await self._get_post_or_404(post_id)
		self._check_ownership(post.author_id, user)
		if body.title is not None:
			post.title = body.title
		if body.content is not None:
			post.content = body.content
		await self.db.commit()
		await self.db.refresh(post)
		result = await self.db.execute(
			select(CommunityPost).where(CommunityPost.id == post.id).options(*_POST_LOAD)
		)
		return _post_to_out(result.scalar_one())

	async def delete_post(self, post_id: int, user: User) -> None:
		post = await self._get_post_or_404(post_id)
		self._check_ownership(post.author_id, user)
		post.is_deleted = True
		await self.db.commit()

	async def add_comment(self, post_id: int, body: CommentCreate, user: User) -> CommentOut:
		await self._get_post_or_404(post_id)
		comment = Comment(post_id=post_id, author_id=user.id, content=body.content)
		self.db.add(comment)
		await self.db.commit()
		await self.db.refresh(comment)
		result = await self.db.execute(
			select(Comment).where(Comment.id == comment.id).options(selectinload(Comment.author))
		)
		return _comment_to_out(result.scalar_one())

	async def delete_comment(self, comment_id: int, user: User) -> None:
		result = await self.db.execute(
			select(Comment).where(Comment.id == comment_id).options(selectinload(Comment.author))
		)
		comment = result.scalar_one_or_none()
		if not comment:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
		self._check_ownership(comment.author_id, user)
		await self.db.delete(comment)
		await self.db.commit()
