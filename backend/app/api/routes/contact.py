from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies import (
    get_current_user,
    get_optional_user,
)
from app.models import ContactMessage, User
from app.schemas.interactions import (
    ContactMessageCreate,
    ContactMessageResponse,
)


router = APIRouter(
    prefix="/contact",
    tags=["Contact"],
)


@router.post(
    "",
    response_model=ContactMessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_message(
    payload: ContactMessageCreate,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    message = ContactMessage(
        user_id=user.id if user else None,
        **payload.model_dump(),
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


@router.get(
    "/my",
    response_model=list[ContactMessageResponse],
)
def get_my_messages(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return list(
        db.scalars(
            select(ContactMessage)
            .where(ContactMessage.user_id == user.id)
            .order_by(ContactMessage.id.desc())
        )
    )