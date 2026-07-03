from datetime import datetime
from typing import Any

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
)


def clean_name_value(value: Any) -> Any:
    if isinstance(value, str):
        return " ".join(value.split())

    return value


def clean_slug_value(value: Any) -> Any:
    if isinstance(value, str):
        return value.strip().lower()

    return value


class CategoryCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
    )
    slug: str = Field(
        min_length=2,
        max_length=100,
        pattern=r"^[a-z0-9-]+$",
    )

    @field_validator("name", mode="before")
    @classmethod
    def clean_name(cls, value: Any) -> Any:
        return clean_name_value(value)

    @field_validator("slug", mode="before")
    @classmethod
    def clean_slug(cls, value: Any) -> Any:
        return clean_slug_value(value)


class CategoryUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    slug: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
        pattern=r"^[a-z0-9-]+$",
    )
    is_active: bool | None = None

    @field_validator("name", mode="before")
    @classmethod
    def clean_name(cls, value: Any) -> Any:
        return clean_name_value(value)

    @field_validator("slug", mode="before")
    @classmethod
    def clean_slug(cls, value: Any) -> Any:
        return clean_slug_value(value)


class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)