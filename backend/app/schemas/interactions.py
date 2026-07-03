from datetime import datetime
from typing import Any

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
)

from app.models import MessageStatus


def clean_text(value: Any) -> Any:
    if isinstance(value, str):
        return " ".join(value.split())
    return value


class ReviewCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: str = Field(min_length=3, max_length=2000)

    @field_validator("comment", mode="before")
    @classmethod
    def normalize_comment(cls, value: Any) -> Any:
        return clean_text(value)


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    rating: int
    comment: str | None
    is_approved: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewApprovalUpdate(BaseModel):
    is_approved: bool


class ContactMessageCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr | None = None
    phone: str = Field(pattern=r"^09\d{9}$")
    subject: str = Field(min_length=2, max_length=150)
    message: str = Field(min_length=5, max_length=3000)

    @field_validator(
        "full_name",
        "subject",
        "message",
        mode="before",
    )
    @classmethod
    def normalize_text(cls, value: Any) -> Any:
        return clean_text(value)

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value: Any) -> Any:
        if isinstance(value, str):
            value = value.strip().lower()
            return value or None
        return value


class ContactMessageResponse(BaseModel):
    id: int
    user_id: int | None
    full_name: str
    email: EmailStr | None
    phone: str
    subject: str
    message: str
    status: MessageStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MessageStatusUpdate(BaseModel):
    status: MessageStatus