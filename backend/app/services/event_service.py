from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.models import Event
from app.schemas.schemas import EventCreate, EventOut, EventUpdate
from app.services.base import BaseService


class EventService(BaseService):
	def __init__(self, db: AsyncSession = Depends(get_db)):
		super().__init__(db)

	async def _get_event_or_404(self, event_id: int) -> Event:
		result = await self.db.execute(
			select(Event).where(Event.id == event_id, Event.is_deleted == False)  # noqa: E712
		)
		event = result.scalar_one_or_none()
		if not event:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
		return event

	async def list_events(self) -> list[EventOut]:
		result = await self.db.execute(
			select(Event)
			.where(Event.is_deleted == False)  # noqa: E712
			.order_by(Event.event_date.asc())
		)
		return result.scalars().all()

	async def get_event(self, event_id: int) -> EventOut:
		return await self._get_event_or_404(event_id)

	async def create_event(self, body: EventCreate) -> EventOut:
		event = Event(**body.model_dump())
		self.db.add(event)
		await self.db.commit()
		await self.db.refresh(event)
		return event

	async def update_event(self, event_id: int, body: EventUpdate) -> EventOut:
		event = await self._get_event_or_404(event_id)
		for field, value in body.model_dump(exclude_unset=True).items():
			setattr(event, field, value)
		await self.db.commit()
		await self.db.refresh(event)
		return event

	async def delete_event(self, event_id: int) -> None:
		event = await self._get_event_or_404(event_id)
		event.is_deleted = True
		await self.db.commit()
