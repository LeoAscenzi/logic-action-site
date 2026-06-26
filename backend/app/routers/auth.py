from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from app.core.security import hash_password
from app.db.session import get_db
from app.models.models import RefreshToken, User, UserRole
from app.routers.deps import get_current_user
from app.schemas.schemas import LoginRequest, ParentRegister, TokenResponse, UserOut

router = APIRouter(tags=["auth"])

REFRESH_COOKIE = "refresh_token"


def _set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=token,
        httponly=True,
        secure=settings.secure_cookies,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    )


@router.get("/me", response_model=UserOut)
async def get_me(user: User = Depends(get_current_user)):
    return user


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    body: ParentRegister,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(
        select(User).where(
            (User.username == body.username) | (User.email == body.email)
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already registered",
        )

    user = User(
        username=body.username,
        fname=body.fname,
        lname=body.lname,
        email=body.email,
        password=hash_password(body.password),
        role=UserRole.parent,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    access_token = create_access_token(str(user.id), user.role.value)
    refresh_token_str = create_refresh_token(str(user.id))

    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(RefreshToken(user_id=user.id, token=refresh_token_str, expires_at=expires_at))
    await db.commit()

    _set_refresh_cookie(response, refresh_token_str)
    return TokenResponse(access_token=access_token)


@router.post("/login", response_model=TokenResponse)
async def login(
    body: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.username == body.username))
    user = result.scalar_one_or_none()

    if not user or not verify_password(body.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(str(user.id), user.role.value)
    refresh_token_str = create_refresh_token(str(user.id))

    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(RefreshToken(user_id=user.id, token=refresh_token_str, expires_at=expires_at))
    await db.commit()

    _set_refresh_cookie(response, refresh_token_str)
    return TokenResponse(access_token=access_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    response: Response,
    db: AsyncSession = Depends(get_db),
    refresh_token: str | None = Cookie(default=None),
):
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token")

    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token == refresh_token,
            RefreshToken.is_valid == True,  # noqa: E712
        )
    )
    stored = result.scalar_one_or_none()

    if not stored or stored.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    stored.is_valid = False

    result = await db.execute(select(User).where(User.id == stored.user_id))
    user = result.scalar_one()

    new_access = create_access_token(str(user.id), user.role.value)
    new_refresh = create_refresh_token(str(user.id))

    new_expires = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(RefreshToken(user_id=user.id, token=new_refresh, expires_at=new_expires))
    await db.commit()

    _set_refresh_cookie(response, new_refresh)
    return TokenResponse(access_token=new_access)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    response: Response,
    db: AsyncSession = Depends(get_db),
    refresh_token: str | None = Cookie(default=None),
):
    if refresh_token:
        result = await db.execute(
            select(RefreshToken).where(RefreshToken.token == refresh_token)
        )
        stored = result.scalar_one_or_none()
        if stored:
            stored.is_valid = False
            await db.commit()

    response.delete_cookie(REFRESH_COOKIE)
