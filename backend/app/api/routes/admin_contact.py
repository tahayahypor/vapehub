from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies import get_current_admin
from app.models import ContactMessage, MessageStatus
from app.schemas.interactions import (
    ContactMessageResponse,
    MessageStatusUpdate,
)


router = APIRouter(
    prefix="/admin/contact-messages",
    tags=["Admin Contact Messages"],
    dependencies=[Depends(get_current_admin)],
)


def find_message(
    message_id: int,
    db: Session,
) -> ContactMessage:
    message = db.get(ContactMessage, message_id)

    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )

    return message


@router.get(
    "",
    response_model=list[ContactMessageResponse],
)
def get_messages(
    message_status: MessageStatus | None = Query(
        default=None,
    ),
    db: Session = Depends(get_db),
):
    query = select(ContactMessage).order_by(
        ContactMessage.id.desc()
    )

    if message_status:
        query = query.where(
            ContactMessage.status == message_status
        )

    return list(db.scalars(query))


@router.patch(
    "/{message_id}",
    response_model=ContactMessageResponse,
)
def update_message_status(
    message_id: int,
    payload: MessageStatusUpdate,
    db: Session = Depends(get_db),
):
    message = find_message(message_id, db)
    message.status = payload.status

    db.commit()
    db.refresh(message)

    return message


@router.delete("/{message_id}")
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
):
    message = find_message(message_id, db)

    db.delete(message)
    db.commit()

    return {
        "message": "Message deleted successfully",
    }