from decimal import Decimal
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.database.session import get_db
from app.models import Category, Product
from app.schemas.product import ProductListResponse, ProductResponse


router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=ProductListResponse)
def get_products(
    search: str | None = Query(default=None, max_length=100),
    category: str | None = Query(default=None, max_length=100),
    min_price: Decimal | None = Query(default=None, ge=0),
    max_price: Decimal | None = Query(default=None, ge=0),
    in_stock: bool | None = Query(default=None),
    sort: Literal[
        "newest",
        "price_asc",
        "price_desc",
        "name",
    ] = "newest",
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=12, ge=1, le=100),
    db: Session = Depends(get_db),
):
    if (
        min_price is not None
        and max_price is not None
        and min_price > max_price
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum price cannot exceed maximum price",
        )

    conditions = [
        Product.is_active.is_(True),
        Category.is_active.is_(True),
    ]

    if search and search.strip():
        value = f"%{search.strip()}%"
        conditions.append(
            or_(
                Product.name.ilike(value),
                Product.brand.ilike(value),
                Product.description.ilike(value),
            )
        )

    if category:
        conditions.append(Category.slug == category.strip().lower())

    if min_price is not None:
        conditions.append(Product.price >= min_price)

    if max_price is not None:
        conditions.append(Product.price <= max_price)

    if in_stock is True:
        conditions.append(Product.stock > 0)
    elif in_stock is False:
        conditions.append(Product.stock == 0)

    total = db.scalar(
        select(func.count(Product.id))
        .join(Category)
        .where(*conditions)
    ) or 0

    sorting = {
        "newest": Product.id.desc(),
        "price_asc": Product.price.asc(),
        "price_desc": Product.price.desc(),
        "name": Product.name.asc(),
    }

    query = (
        select(Product)
        .join(Category)
        .options(selectinload(Product.category))
        .where(*conditions)
        .order_by(sorting[sort])
        .offset(skip)
        .limit(limit)
    )

    return ProductListResponse(
        total=total,
        skip=skip,
        limit=limit,
        items=list(db.scalars(query)),
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = db.scalar(
        select(Product)
        .join(Category)
        .options(selectinload(Product.category))
        .where(
            Product.id == product_id,
            Product.is_active.is_(True),
            Category.is_active.is_(True),
        )
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product