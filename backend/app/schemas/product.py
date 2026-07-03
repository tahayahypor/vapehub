from datetime import datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.category import CategoryResponse


def clean_text(value: Any) -> Any:
    if isinstance(value, str):
        return " ".join(value.split())
    return value


def clean_slug(value: Any) -> Any:
    if isinstance(value, str):
        return value.strip().lower()
    return value


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    slug: str = Field(
        min_length=2,
        max_length=220,
        pattern=r"^[a-z0-9-]+$",
    )
    brand: str | None = Field(default=None, max_length=120)
    description: str | None = Field(default=None, max_length=5000)
    price: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    stock: int = Field(default=0, ge=0)
    image_url: str | None = Field(default=None, max_length=500)
    specifications: dict[str, Any] = Field(default_factory=dict)
    category_id: int = Field(gt=0)
    is_active: bool = True

    @field_validator("name", "brand", mode="before")
    @classmethod
    def normalize_text(cls, value: Any) -> Any:
        return clean_text(value)

    @field_validator("slug", mode="before")
    @classmethod
    def normalize_slug(cls, value: Any) -> Any:
        return clean_slug(value)


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    slug: str | None = Field(
        default=None,
        min_length=2,
        max_length=220,
        pattern=r"^[a-z0-9-]+$",
    )
    brand: str | None = Field(default=None, max_length=120)
    description: str | None = Field(default=None, max_length=5000)
    price: Decimal | None = Field(
        default=None,
        gt=0,
        max_digits=14,
        decimal_places=2,
    )
    stock: int | None = Field(default=None, ge=0)
    image_url: str | None = Field(default=None, max_length=500)
    specifications: dict[str, Any] | None = None
    category_id: int | None = Field(default=None, gt=0)
    is_active: bool | None = None

    @field_validator("name", "brand", mode="before")
    @classmethod
    def normalize_text(cls, value: Any) -> Any:
        return clean_text(value)

    @field_validator("slug", mode="before")
    @classmethod
    def normalize_slug(cls, value: Any) -> Any:
        return clean_slug(value)


class ProductResponse(BaseModel):
    id: int
    name: str
    slug: str
    brand: str | None
    description: str | None
    price: Decimal
    stock: int
    image_url: str | None
    specifications: dict[str, Any]
    is_active: bool
    category_id: int
    category: CategoryResponse
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductListResponse(BaseModel):
    total: int
    skip: int
    limit: int
    items: list[ProductResponse]