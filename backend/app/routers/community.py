from fastapi import APIRouter, Depends, status

from app.models.models import User
from app.routers.deps import get_current_user
from app.schemas.schemas import (
	CommentCreate,
	CommentOut,
	CommunityPostCreate,
	CommunityPostDetailOut,
	CommunityPostOut,
	CommunityPostUpdate,
	EventOut,
)
from app.services.community_service import CommunityService
from app.services.event_service import EventService

router = APIRouter(prefix="/community", tags=["community"])


@router.get("/my-posts", response_model=list[CommunityPostOut])
async def my_posts(
	user: User = Depends(get_current_user),
	svc: CommunityService = Depends(CommunityService),
):
	return await svc.list_my_posts(user.id)


@router.get("/posts", response_model=list[CommunityPostOut])
async def list_posts(
	skip: int = 0,
	limit: int = 10,
	_: User = Depends(get_current_user),
	svc: CommunityService = Depends(CommunityService),
):
	return await svc.list_posts(skip=skip, limit=limit)


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
	_: User = Depends(get_current_user),
	svc: EventService = Depends(EventService),
):
	return await svc.list_events()


@router.get("/events/{event_id}", response_model=EventOut)
async def get_event(
	event_id: int,
	_: User = Depends(get_current_user),
	svc: EventService = Depends(EventService),
):
	return await svc.get_event(event_id)
