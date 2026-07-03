from datetime import datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models import (
    OrderStatus,
    PaymentMethod,
    ShippingMethod,
)


def clean_text(value: Any) -> Any:
    if isinstance(value, str):
        return " ".join(value.split())
    return value


class OrderItemCreate(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(ge=1, le=99)


class OrderCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    phone: str = Field(pattern=r"^09\d{9}$")
    province: str = Field(min_length=2, max_length=100)
    city: str = Field(min_length=2, max_length=100)
    postal_code: str = Field(pattern=r"^\d{10}$")
    address: str = Field(min_length=10, max_length=1000)
    shipping_method: ShippingMethod = ShippingMethod.POST
    payment_method: PaymentMethod = PaymentMethod.ONLINE
    note: str | None = Field(default=None, max_length=1000)
    items: list[OrderItemCreate] = Field(min_length=1, max_length=50)

    @field_validator(
        "full_name",
        "province",
        "city",
        "address",
        "note",
        mode="before",
    )
    @classmethod
    def normalize_text(cls, value: Any) -> Any:
        return clean_text(value)


class OrderUserResponse(BaseModel):
    id: int
    full_name: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class OrderProductResponse(BaseModel):
    id: int
    name: str
    slug: str
    image_url: str | None

    model_config = ConfigDict(from_attributes=True)


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: Decimal
    product: OrderProductResponse

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: int
    user_id: int
    user: OrderUserResponse
    status: OrderStatus
    full_name: str
    phone: str
    province: str
    city: str
    postal_code: str
    address: str
    shipping_method: ShippingMethod
    payment_method: PaymentMethod
    note: str | None
    subtotal: Decimal
    shipping_cost: Decimal
    total_price: Decimal
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemResponse]

    model_config = ConfigDict(from_attributes=True)


class OrderListResponse(BaseModel):
    total: int
    skip: int
    limit: int
    items: list[OrderResponse]


class OrderStatusUpdate(BaseModel):
    status: OrderStatus