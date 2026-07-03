import enum
from datetime import datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Index,
    Integer,
    JSON,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


def enum_values(enum_class: type[enum.Enum]) -> list[str]:
    return [item.value for item in enum_class]


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class MessageStatus(str, enum.Enum):
    NEW = "new"
    READ = "read"
    RESOLVED = "resolved"


class ShippingMethod(str, enum.Enum):
    POST = "post"
    EXPRESS = "express"


class PaymentMethod(str, enum.Enum):
    ONLINE = "online"
    CARD = "card"


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    full_name: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[UserRole] = mapped_column(
        SAEnum(
            UserRole,
            values_callable=enum_values,
            name="user_role_enum",
        ),
        nullable=False,
        default=UserRole.USER,
        server_default=UserRole.USER.value,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="1",
    )

    orders: Mapped[list["Order"]] = relationship(
        back_populates="user",
        passive_deletes=True,
    )

    reviews: Mapped[list["Review"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    contact_messages: Mapped[
        list["ContactMessage"]
    ] = relationship(
        back_populates="user",
        passive_deletes=True,
    )


class Category(TimestampMixin, Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="1",
    )

    products: Mapped[list["Product"]] = relationship(
        back_populates="category",
        passive_deletes=True,
    )


class Product(TimestampMixin, Base):
    __tablename__ = "products"

    __table_args__ = (
        CheckConstraint(
            "price >= 0",
            name="ck_product_price_non_negative",
        ),
        CheckConstraint(
            "stock >= 0",
            name="ck_product_stock_non_negative",
        ),
        Index(
            "ix_products_category_active",
            "category_id",
            "is_active",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    slug: Mapped[str] = mapped_column(
        String(220),
        unique=True,
        index=True,
        nullable=False,
    )

    brand: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
    )

    stock: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default="0",
    )

    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    specifications: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="1",
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey(
            "categories.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    category: Mapped["Category"] = relationship(
        back_populates="products",
    )

    order_items: Mapped[list["OrderItem"]] = relationship(
        back_populates="product",
        passive_deletes=True,
    )

    reviews: Mapped[list["Review"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class Order(TimestampMixin, Base):
    __tablename__ = "orders"

    __table_args__ = (
        CheckConstraint(
            "subtotal >= 0",
            name="ck_order_subtotal_non_negative",
        ),
        CheckConstraint(
            "shipping_cost >= 0",
            name="ck_order_shipping_non_negative",
        ),
        CheckConstraint(
            "total_price >= 0",
            name="ck_order_total_non_negative",
        ),
        Index(
            "ix_orders_user_created",
            "user_id",
            "created_at",
        ),
        Index(
            "ix_orders_status_created",
            "status",
            "created_at",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    status: Mapped[OrderStatus] = mapped_column(
        SAEnum(
            OrderStatus,
            values_callable=enum_values,
            name="order_status_enum",
        ),
        nullable=False,
        default=OrderStatus.PENDING,
        server_default=OrderStatus.PENDING.value,
    )

    full_name: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    province: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    city: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    postal_code: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    address: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    shipping_method: Mapped[
        ShippingMethod
    ] = mapped_column(
        SAEnum(
            ShippingMethod,
            values_callable=enum_values,
            name="shipping_method_enum",
        ),
        nullable=False,
        default=ShippingMethod.POST,
        server_default=ShippingMethod.POST.value,
    )

    payment_method: Mapped[
        PaymentMethod
    ] = mapped_column(
        SAEnum(
            PaymentMethod,
            values_callable=enum_values,
            name="payment_method_enum",
        ),
        nullable=False,
        default=PaymentMethod.ONLINE,
        server_default=PaymentMethod.ONLINE.value,
    )

    note: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    subtotal: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
    )

    shipping_cost: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
    )

    total_price: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        back_populates="orders",
    )

    items: Mapped[list["OrderItem"]] = relationship(
        back_populates="order",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    __table_args__ = (
        UniqueConstraint(
            "order_id",
            "product_id",
            name="uq_order_product",
        ),
        CheckConstraint(
            "quantity > 0",
            name="ck_order_item_quantity_positive",
        ),
        CheckConstraint(
            "unit_price >= 0",
            name="ck_order_item_price_non_negative",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    order_id: Mapped[int] = mapped_column(
        ForeignKey(
            "orders.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey(
            "products.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    unit_price: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
    )

    order: Mapped["Order"] = relationship(
        back_populates="items",
    )

    product: Mapped["Product"] = relationship(
        back_populates="order_items",
    )


class Review(TimestampMixin, Base):
    __tablename__ = "reviews"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "product_id",
            name="uq_user_product_review",
        ),
        CheckConstraint(
            "rating BETWEEN 1 AND 5",
            name="ck_review_rating",
        ),
        Index(
            "ix_reviews_product_approved",
            "product_id",
            "is_approved",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey(
            "products.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    rating: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    comment: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    is_approved: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="0",
    )

    user: Mapped["User"] = relationship(
        back_populates="reviews",
    )

    product: Mapped["Product"] = relationship(
        back_populates="reviews",
    )


class ContactMessage(TimestampMixin, Base):
    __tablename__ = "contact_messages"

    __table_args__ = (
        Index(
            "ix_contact_status_created",
            "status",
            "created_at",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    full_name: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    subject: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    status: Mapped[MessageStatus] = mapped_column(
        SAEnum(
            MessageStatus,
            values_callable=enum_values,
            name="message_status_enum",
        ),
        nullable=False,
        default=MessageStatus.NEW,
        server_default=MessageStatus.NEW.value,
    )

    user: Mapped[User | None] = relationship(
        back_populates="contact_messages",
    )