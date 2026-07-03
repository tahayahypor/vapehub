from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import String, cast, func, or_, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, selectinload

from app.database.session import get_db
from app.dependencies import get_current_admin
from app.models import (
    Order,
    OrderItem,
    OrderStatus,
    Product,
    User,
)
from app.schemas.order import (
    OrderListResponse,
    OrderResponse,
    OrderStatusUpdate,
)


router = APIRouter(
    prefix="/admin/orders",
    tags=["Admin Orders"],
    dependencies=[Depends(get_current_admin)],
)


ALLOWED_TRANSITIONS = {
    OrderStatus.PENDING: {
        OrderStatus.CONFIRMED,
        OrderStatus.CANCELLED,
    },
    OrderStatus.CONFIRMED: {
        OrderStatus.PROCESSING,
        OrderStatus.CANCELLED,
    },
    OrderStatus.PROCESSING: {
        OrderStatus.SHIPPED,
        OrderStatus.CANCELLED,
    },
    OrderStatus.SHIPPED: {
        OrderStatus.DELIVERED,
    },
    OrderStatus.DELIVERED: set(),
    OrderStatus.CANCELLED: {
        OrderStatus.PENDING,
    },
}


def load_admin_order(order_id: int, db: Session) -> Order:
    order = db.scalar(
        select(Order)
        .options(
            selectinload(Order.user),
            selectinload(Order.items).selectinload(OrderItem.product),
        )
        .where(Order.id == order_id)
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    return order


def lock_order_products(
    order: Order,
    db: Session,
) -> dict[int, Product]:
    product_ids = [item.product_id for item in order.items]

    products = list(
        db.scalars(
            select(Product)
            .where(Product.id.in_(product_ids))
            .with_for_update()
        )
    )

    product_map = {product.id: product for product in products}

    if len(product_map) != len(product_ids):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="One or more order products no longer exist",
        )

    return product_map


@router.get("", response_model=OrderListResponse)
def get_all_orders(
    search: str | None = Query(default=None, max_length=100),
    order_status: OrderStatus | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    conditions = []

    if order_status is not None:
        conditions.append(Order.status == order_status)

    if search and search.strip():
        value = f"%{search.strip()}%"

        conditions.append(
            or_(
                cast(Order.id, String).like(value),
                Order.full_name.ilike(value),
                Order.phone.ilike(value),
                User.email.ilike(value),
            )
        )

    total = db.scalar(
        select(func.count(Order.id))
        .join(User)
        .where(*conditions)
    ) or 0

    query = (
        select(Order)
        .join(User)
        .options(
            selectinload(Order.user),
            selectinload(Order.items).selectinload(OrderItem.product),
        )
        .where(*conditions)
        .order_by(Order.id.desc())
        .offset(skip)
        .limit(limit)
    )

    return OrderListResponse(
        total=total,
        skip=skip,
        limit=limit,
        items=list(db.scalars(query)),
    )


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    return load_admin_order(order_id, db)


@router.patch(
    "/{order_id}/status",
    response_model=OrderResponse,
)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
):
    order = load_admin_order(order_id, db)
    old_status = order.status
    new_status = payload.status

    if old_status == new_status:
        return order

    allowed_statuses = ALLOWED_TRANSITIONS.get(old_status, set())

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"Status cannot change from "
                f"{old_status.value} to {new_status.value}"
            ),
        )

    if new_status == OrderStatus.CANCELLED:
        product_map = lock_order_products(order, db)

        for item in order.items:
            product_map[item.product_id].stock += item.quantity

    if old_status == OrderStatus.CANCELLED:
        product_map = lock_order_products(order, db)

        for item in order.items:
            product = product_map[item.product_id]

            if product.stock < item.quantity:
                db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Insufficient stock for {product.name}",
                )

        for item in order.items:
            product_map[item.product_id].stock -= item.quantity

    order.status = new_status

    try:
        db.commit()
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Order status could not be updated",
        ) from error

    return load_admin_order(order.id, db)


@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    order = load_admin_order(order_id, db)

    blocked_statuses = {
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED,
    }

    if order.status in blocked_statuses:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Shipped or delivered orders cannot be deleted",
        )

    if order.status != OrderStatus.CANCELLED:
        product_map = lock_order_products(order, db)

        for item in order.items:
            product_map[item.product_id].stock += item.quantity

    db.delete(order)

    try:
        db.commit()
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Order could not be deleted",
        ) from error

    return {
        "message": "Order deleted successfully",
    }