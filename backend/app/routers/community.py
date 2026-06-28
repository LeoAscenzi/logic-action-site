from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.models import Event, EventRegistration, User
from app.routers.deps import get_current_user
from app.schemas.schemas import (
	CommentCreate,
	CommentOut,
	CommunityPostCreate,
	CommunityPostDetailOut,
	CommunityPostOut,
	CommunityPostUpdate,
	EventOut,
	EventRsvpIn,
	EventRsvpOut,
	MyCommentOut,
	PublicUserOut,
)
from app.services.community_service import CommunityService
from app.services.email_service import send_rsvp_admin_notification, send_rsvp_confirmation
from app.services.event_service import EventService

router = APIRouter(prefix="/community", tags=["community"])


@router.get("/my-posts", response_model=list[CommunityPostOut])
async def my_posts(
	user: User = Depends(get_current_user),
	svc: CommunityService = Depends(CommunityService),
):
	return await svc.list_my_posts(user.id)


@router.get("/my-comments", response_model=list[MyCommentOut])
async def my_comments(
	user: User = Depends(get_current_user),
	svc: CommunityService = Depends(CommunityService),
):
	return await svc.list_my_comments(user.id)


@router.get("/users/{user_id}", response_model=PublicUserOut)
async def get_public_user(
	user_id: int,
	_: User = Depends(get_current_user),
	db: AsyncSession = Depends(get_db),
):
	result = await db.execute(select(User).where(User.id == user_id))
	user = result.scalar_one_or_none()
	if not user:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
	return user


@router.get("/posts", response_model=list[CommunityPostOut])
async def list_posts(
	skip: int = 0,
	limit: int = 10,
	author_id: Optional[int] = None,
	_: User = Depends(get_current_user),
	svc: CommunityService = Depends(CommunityService),
):
	return await svc.list_posts(skip=skip, limit=limit, author_id=author_id)


@router.post("/posts", response_model=CommunityPostOut, status_code=status.HTTP_201_CREATED)
async def create_post(
	body: CommunityPostCreate,
	user: User = Depends(get_current_user),
	svc: CommunityService = Depends(CommunityService),
):
	return await svc.create_post(body, user)


@router.get("/posts/{post_id}", response_model=CommunityPostDetailOut)
async def get_post(
	post_id: int,
	_: User = Depends(get_current_user),
	svc: CommunityService = Depends(CommunityService),
):
	return await svc.get_post(post_id)


@router.patch("/posts/{post_id}", response_model=CommunityPostOut)
async def update_post(
	post_id: int,
	body: CommunityPostUpdate,
	user: User = Depends(get_current_user),
	svc: CommunityService = Depends(CommunityService),
):
	return await svc.update_post(post_id, body, user)


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
	post_id: int,
	user: User = Depends(get_current_user),
	svc: CommunityService = Depends(CommunityService),
):
	await svc.delete_post(post_id, user)


@router.post("/posts/{post_id}/comments", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
async def add_comment(
	post_id: int,
	body: CommentCreate,
	user: User = Depends(get_current_user),
	svc: CommunityService = Depends(CommunityService),
):
	return await svc.add_comment(post_id, body, user)


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
	comment_id: int,
	user: User = Depends(get_current_user),
	svc: CommunityService = Depends(CommunityService),
):
	await svc.delete_comment(comment_id, user)


@router.get("/events", response_model=list[EventOut])
async def list_events(
	svc: EventService = Depends(EventService),
):
	return await svc.list_events()


@router.get("/events/{event_id}", response_model=EventOut)
async def get_event(
	event_id: int,
	svc: EventService = Depends(EventService),
):
	return await svc.get_event(event_id)


@router.post("/events/{event_id}/rsvp", response_model=EventRsvpOut, status_code=status.HTTP_201_CREATED)
async def rsvp_event(
	event_id: int,
	body: EventRsvpIn,
	db: AsyncSession = Depends(get_db),
):
	result = await db.execute(select(Event).where(Event.id == event_id, Event.is_deleted == False))  # noqa: E712
	event = result.scalar_one_or_none()
	if not event:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

	existing = await db.execute(
		select(EventRegistration).where(
			EventRegistration.event_id == event_id,
			EventRegistration.email == body.email,
		)
	)
	if existing.scalar_one_or_none():
		raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already registered for this event")

	reg = EventRegistration(event_id=event_id, name=body.name, email=body.email)
	db.add(reg)
	await db.commit()
	await db.refresh(reg)

	event_date_str = event.event_date.strftime("%B %-d, %Y")
	await send_rsvp_confirmation(body.email, body.name, event.title, event_date_str)
	await send_rsvp_admin_notification(event.title, body.name, body.email)

	return reg
