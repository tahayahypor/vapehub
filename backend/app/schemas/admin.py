from datetime import datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models import OrderStatus, UserRole
from app.schemas.auth import UserResponse


class UserAdminUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    email: EmailStr | None = None
    role: UserRole | None = None
    is_active: bool | None = None

    @field_validator("full_name", mode="before")
    @classmethod
    def clean_name(cls, value: Any) -> Any:
        if isinstance(value, str):
            return " ".join(value.split())
        return value

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value: Any) -> Any:
        if isinstance(value, str):
            return value.strip().lower()
        return value


class UserListResponse(BaseModel):
    total: int
    skip: int
    limit: int
    items: list[UserResponse]


class DashboardOrderResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    status: OrderStatus
    total_price: Decimal
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardResponse(BaseModel):
    total_users: int
    active_users: int
    total_categories: int
    total_products: int
    active_products: int
    total_orders: int
    pending_orders: int
    total_revenue: Decimal
    total_reviews: int
    pending_reviews: int
    new_messages: int
    latest_users: list[UserResponse]
    latest_orders: list[DashboardOrderResponse]