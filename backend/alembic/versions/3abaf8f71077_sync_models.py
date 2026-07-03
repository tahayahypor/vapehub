"""sync models

Revision ID: 3abaf8f71077
Revises: 33b38d125653
Create Date: 2026-06-23 02:07:03.751466
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql


revision: str = "3abaf8f71077"
down_revision: Union[str, Sequence[str], None] = "33b38d125653"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Categories
    op.add_column(
        "categories",
        sa.Column(
            "is_active",
            sa.Boolean(),
            server_default="1",
            nullable=False,
        ),
    )
    op.add_column(
        "categories",
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )
    op.add_column(
        "categories",
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )

    # Contact messages
    op.add_column(
        "contact_messages",
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )

    op.alter_column(
        "contact_messages",
        "status",
        existing_type=mysql.ENUM(
            "NEW",
            "READ",
            "RESOLVED",
        ),
        type_=sa.String(length=20),
        existing_nullable=False,
    )

    op.execute(
        """
        UPDATE contact_messages
        SET status = LOWER(status)
        """
    )

    op.alter_column(
        "contact_messages",
        "status",
        existing_type=sa.String(length=20),
        type_=mysql.ENUM(
            "new",
            "read",
            "resolved",
        ),
        nullable=False,
        server_default="new",
    )

    op.create_index(
        "ix_contact_status_created",
        "contact_messages",
        ["status", "created_at"],
        unique=False,
    )

    # Order items
    op.alter_column(
        "order_items",
        "unit_price",
        existing_type=mysql.DECIMAL(
            precision=12,
            scale=2,
        ),
        type_=sa.Numeric(
            precision=14,
            scale=2,
        ),
        existing_nullable=False,
    )

    op.drop_constraint(
        "order_items_ibfk_1",
        "order_items",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "fk_order_items_order_id",
        "order_items",
        "orders",
        ["order_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # Orders
    op.add_column(
        "orders",
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )

    op.alter_column(
        "orders",
        "status",
        existing_type=mysql.ENUM(
            "PENDING",
            "CONFIRMED",
            "SHIPPED",
            "CANCELLED",
        ),
        type_=sa.String(length=30),
        existing_nullable=False,
    )

    op.execute(
        """
        UPDATE orders
        SET status = LOWER(status)
        """
    )

    op.alter_column(
        "orders",
        "status",
        existing_type=sa.String(length=30),
        type_=mysql.ENUM(
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ),
        nullable=False,
        server_default="pending",
    )

    op.alter_column(
        "orders",
        "shipping_method",
        existing_type=mysql.VARCHAR(length=30),
        type_=mysql.ENUM(
            "post",
            "express",
        ),
        existing_nullable=False,
        server_default="post",
    )

    op.alter_column(
        "orders",
        "payment_method",
        existing_type=mysql.VARCHAR(length=30),
        type_=mysql.ENUM(
            "online",
            "card",
        ),
        existing_nullable=False,
        server_default="online",
    )

    op.alter_column(
        "orders",
        "subtotal",
        existing_type=mysql.DECIMAL(
            precision=12,
            scale=2,
        ),
        type_=sa.Numeric(
            precision=14,
            scale=2,
        ),
        existing_nullable=False,
    )

    op.alter_column(
        "orders",
        "shipping_cost",
        existing_type=mysql.DECIMAL(
            precision=12,
            scale=2,
        ),
        type_=sa.Numeric(
            precision=14,
            scale=2,
        ),
        existing_nullable=False,
    )

    op.alter_column(
        "orders",
        "total_price",
        existing_type=mysql.DECIMAL(
            precision=12,
            scale=2,
        ),
        type_=sa.Numeric(
            precision=14,
            scale=2,
        ),
        existing_nullable=False,
    )

    op.create_index(
        "ix_orders_status_created",
        "orders",
        ["status", "created_at"],
        unique=False,
    )

    op.create_index(
        "ix_orders_user_created",
        "orders",
        ["user_id", "created_at"],
        unique=False,
    )

    # Products
    op.add_column(
        "products",
        sa.Column(
            "brand",
            sa.String(length=120),
            nullable=True,
        ),
    )

    # ابتدا nullable است تا محصولات قبلی خراب نشوند.
    op.add_column(
        "products",
        sa.Column(
            "specifications",
            mysql.JSON(),
            nullable=True,
        ),
    )

    op.execute(
        """
        UPDATE products
        SET specifications = JSON_OBJECT()
        WHERE specifications IS NULL
        """
    )

    op.alter_column(
        "products",
        "specifications",
        existing_type=mysql.JSON(),
        nullable=False,
    )

    op.add_column(
        "products",
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )

    op.alter_column(
        "products",
        "price",
        existing_type=mysql.DECIMAL(
            precision=12,
            scale=2,
        ),
        type_=sa.Numeric(
            precision=14,
            scale=2,
        ),
        existing_nullable=False,
    )

    op.create_index(
        "ix_products_brand",
        "products",
        ["brand"],
        unique=False,
    )

    op.create_index(
        "ix_products_category_active",
        "products",
        ["category_id", "is_active"],
        unique=False,
    )

    # Reviews
    op.add_column(
        "reviews",
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )

    op.alter_column(
        "reviews",
        "comment",
        existing_type=mysql.TEXT(),
        nullable=True,
    )

    op.create_index(
        "ix_reviews_product_approved",
        "reviews",
        ["product_id", "is_approved"],
        unique=False,
    )

    op.drop_constraint(
        "reviews_ibfk_1",
        "reviews",
        type_="foreignkey",
    )
    op.drop_constraint(
        "reviews_ibfk_2",
        "reviews",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "fk_reviews_user_id",
        "reviews",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.create_foreign_key(
        "fk_reviews_product_id",
        "reviews",
        "products",
        ["product_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # Users
    op.add_column(
        "users",
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )

    op.alter_column(
        "users",
        "role",
        existing_type=mysql.ENUM(
            "USER",
            "ADMIN",
        ),
        type_=sa.String(length=20),
        existing_nullable=False,
    )

    op.execute(
        """
        UPDATE users
        SET role = LOWER(role)
        """
    )

    op.alter_column(
        "users",
        "role",
        existing_type=sa.String(length=20),
        type_=mysql.ENUM(
            "user",
            "admin",
        ),
        nullable=False,
        server_default="user",
    )


def downgrade() -> None:
    # Users
    op.alter_column(
        "users",
        "role",
        existing_type=mysql.ENUM(
            "user",
            "admin",
        ),
        type_=sa.String(length=20),
        existing_nullable=False,
    )

    op.execute(
        """
        UPDATE users
        SET role = UPPER(role)
        """
    )

    op.alter_column(
        "users",
        "role",
        existing_type=sa.String(length=20),
        type_=mysql.ENUM(
            "USER",
            "ADMIN",
        ),
        nullable=False,
        server_default="USER",
    )

    op.drop_column("users", "updated_at")

    # Reviews
    op.drop_constraint(
        "fk_reviews_product_id",
        "reviews",
        type_="foreignkey",
    )
    op.drop_constraint(
        "fk_reviews_user_id",
        "reviews",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "reviews_ibfk_1",
        "reviews",
        "products",
        ["product_id"],
        ["id"],
    )
    op.create_foreign_key(
        "reviews_ibfk_2",
        "reviews",
        "users",
        ["user_id"],
        ["id"],
    )

    op.drop_index(
        "ix_reviews_product_approved",
        table_name="reviews",
    )

    op.alter_column(
        "reviews",
        "comment",
        existing_type=mysql.TEXT(),
        nullable=False,
    )

    op.drop_column("reviews", "updated_at")

    # Products
    op.drop_index(
        "ix_products_category_active",
        table_name="products",
    )
    op.drop_index(
        "ix_products_brand",
        table_name="products",
    )

    op.alter_column(
        "products",
        "price",
        existing_type=sa.Numeric(
            precision=14,
            scale=2,
        ),
        type_=mysql.DECIMAL(
            precision=12,
            scale=2,
        ),
        existing_nullable=False,
    )

    op.drop_column("products", "updated_at")
    op.drop_column("products", "specifications")
    op.drop_column("products", "brand")

    # Orders
    op.drop_index(
        "ix_orders_user_created",
        table_name="orders",
    )
    op.drop_index(
        "ix_orders_status_created",
        table_name="orders",
    )

    op.alter_column(
        "orders",
        "total_price",
        existing_type=sa.Numeric(
            precision=14,
            scale=2,
        ),
        type_=mysql.DECIMAL(
            precision=12,
            scale=2,
        ),
        existing_nullable=False,
    )

    op.alter_column(
        "orders",
        "shipping_cost",
        existing_type=sa.Numeric(
            precision=14,
            scale=2,
        ),
        type_=mysql.DECIMAL(
            precision=12,
            scale=2,
        ),
        existing_nullable=False,
    )

    op.alter_column(
        "orders",
        "subtotal",
        existing_type=sa.Numeric(
            precision=14,
            scale=2,
        ),
        type_=mysql.DECIMAL(
            precision=12,
            scale=2,
        ),
        existing_nullable=False,
    )

    op.alter_column(
        "orders",
        "payment_method",
        existing_type=mysql.ENUM(
            "online",
            "card",
        ),
        type_=mysql.VARCHAR(length=30),
        existing_nullable=False,
    )

    op.alter_column(
        "orders",
        "shipping_method",
        existing_type=mysql.ENUM(
            "post",
            "express",
        ),
        type_=mysql.VARCHAR(length=30),
        existing_nullable=False,
    )

    op.alter_column(
        "orders",
        "status",
        existing_type=mysql.ENUM(
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ),
        type_=sa.String(length=30),
        existing_nullable=False,
    )

    op.execute(
        """
        UPDATE orders
        SET status = 'confirmed'
        WHERE status = 'processing'
        """
    )

    op.execute(
        """
        UPDATE orders
        SET status = 'shipped'
        WHERE status = 'delivered'
        """
    )

    op.execute(
        """
        UPDATE orders
        SET status = UPPER(status)
        """
    )

    op.alter_column(
        "orders",
        "status",
        existing_type=sa.String(length=30),
        type_=mysql.ENUM(
            "PENDING",
            "CONFIRMED",
            "SHIPPED",
            "CANCELLED",
        ),
        nullable=False,
        server_default="PENDING",
    )

    op.drop_column("orders", "updated_at")

    # Order items
    op.drop_constraint(
        "fk_order_items_order_id",
        "order_items",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "order_items_ibfk_1",
        "order_items",
        "orders",
        ["order_id"],
        ["id"],
    )

    op.alter_column(
        "order_items",
        "unit_price",
        existing_type=sa.Numeric(
            precision=14,
            scale=2,
        ),
        type_=mysql.DECIMAL(
            precision=12,
            scale=2,
        ),
        existing_nullable=False,
    )

    # Contact messages
    op.drop_index(
        "ix_contact_status_created",
        table_name="contact_messages",
    )

    op.alter_column(
        "contact_messages",
        "status",
        existing_type=mysql.ENUM(
            "new",
            "read",
            "resolved",
        ),
        type_=sa.String(length=20),
        existing_nullable=False,
    )

    op.execute(
        """
        UPDATE contact_messages
        SET status = UPPER(status)
        """
    )

    op.alter_column(
        "contact_messages",
        "status",
        existing_type=sa.String(length=20),
        type_=mysql.ENUM(
            "NEW",
            "READ",
            "RESOLVED",
        ),
        nullable=False,
        server_default="NEW",
    )

    op.drop_column(
        "contact_messages",
        "updated_at",
    )

    # Categories
    op.drop_column("categories", "updated_at")
    op.drop_column("categories", "created_at")
    op.drop_column("categories", "is_active")