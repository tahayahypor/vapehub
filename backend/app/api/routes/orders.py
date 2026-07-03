from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, selectinload

from app.database.session import get_db
from app.dependencies import get_current_user
from app.models import (
    Category,
    Order,
    OrderItem,
    Product,
    ShippingMethod,
    User,
)
from app.schemas.order import (
    OrderCreate,
    OrderListResponse,
    OrderResponse,
)


router = APIRouter(prefix="/orders", tags=["Orders"])

SHIPPING_COSTS = {
    ShippingMethod.POST: Decimal("120000"),
    ShippingMethod.EXPRESS: Decimal("220000"),
}


def load_user_order(
    order_id: int,
    user_id: int,
    db: Session,
) -> Order:
    order = db.scalar(
        select(Order)
        .options(
            selectinload(Order.user),
            selectinload(Order.items).selectinload(OrderItem.product),
        )
        .where(
            Order.id == order_id,
            Order.user_id == user_id,
        )
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    return order


@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    product_ids = [item.product_id for item in payload.items]

    if len(product_ids) != len(set(product_ids)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duplicate products are not allowed",
        )

    products = list(
        db.scalars(
            select(Product)
            .join(Category)
            .where(
                Product.id.in_(product_ids),
                Product.is_active.is_(True),
                Category.is_active.is_(True),
            )
            .with_for_update()
        )
    )

    product_map = {product.id: product for product in products}

    if len(product_map) != len(product_ids):
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more products are unavailable",
        )

    order = Order(
        user_id=user.id,
        full_name=payload.full_name,
        phone=payload.phone,
        province=payload.province,
        city=payload.city,
        postal_code=payload.postal_code,
        address=payload.address,
        shipping_method=payload.shipping_method,
        payment_method=payload.payment_method,
        note=payload.note,
        subtotal=Decimal("0"),
        shipping_cost=SHIPPING_COSTS[payload.shipping_method],
        total_price=Decimal("0"),
    )

    subtotal = Decimal("0")

    for requested_item in payload.items:
        product = product_map[requested_item.product_id]

        if product.stock < requested_item.quantity:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Insufficient stock for {product.name}",
            )

        product.stock -= requested_item.quantity
        subtotal += product.price * requested_item.quantity

        order.items.append(
            OrderItem(
                product_id=product.id,
                quantity=requested_item.quantity,
                unit_price=product.price,
            )
        )

    order.subtotal = subtotal
    order.total_price = subtotal + order.shipping_cost

    try:
        db.add(order)
        db.flush()
        order_id = order.id
        db.commit()
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Order could not be created",
        ) from error

    return load_user_order(order_id, user.id, db)


@router.get("/my", response_model=OrderListResponse)
def get_my_orders(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    total = db.scalar(
        select(func.count(Order.id)).where(Order.user_id == user.id)
    ) or 0

    query = (
        select(Order)
        .options(
            selectinload(Order.user),
            selectinload(Order.items).selectinload(OrderItem.product),
        )
        .where(Order.user_id == user.id)
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
def get_my_order(
    order_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return load_user_order(order_id, user.id, db)