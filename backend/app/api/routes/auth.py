from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.database.session import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import UserLogin, UserRegister, UserResponse


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

COOKIE_NAME = "access_token"


def set_auth_cookie(
    response: Response,
    user: User,
) -> None:
    token = create_access_token(
        user_id=user.id,
        role=user.role,
    )

    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=settings.access_token_minutes * 60,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    payload: UserRegister,
    response: Response,
    db: Session = Depends(get_db),
):
    existing_user = db.scalar(
        select(User).where(
            func.lower(User.email) == payload.email
        )
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    try:
        password_hash = hash_password(
            payload.password
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=password_hash,
    )

    db.add(user)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    db.refresh(user)
    set_auth_cookie(response, user)

    return user


@router.post(
    "/login",
    response_model=UserResponse,
)
def login(
    payload: UserLogin,
    response: Response,
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).where(
            func.lower(User.email) == payload.email
        )
    )

    if (
        not user
        or not verify_password(
            payload.password,
            user.password_hash,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    set_auth_cookie(response, user)

    return user


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key=COOKIE_NAME,
        path="/",
        secure=True,
        samesite="none",
    )

    return {
        "message": "Logged out successfully",
    }


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    user: User = Depends(get_current_user),
):
    return user