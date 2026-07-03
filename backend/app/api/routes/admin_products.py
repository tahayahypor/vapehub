from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.database.session import get_db
from app.dependencies import get_current_admin
from app.models import Category, OrderItem, Product
from app.schemas.product import (
    ProductCreate,
    ProductListResponse,
    ProductResponse,
    ProductUpdate,
)


router = APIRouter(
    prefix="/admin/products",
    tags=["Admin Products"],
    dependencies=[Depends(get_current_admin)],
)


def find_product(product_id: int, db: Session) -> Product:
    product = db.scalar(
        select(Product)
        .options(selectinload(Product.category))
        .where(Product.id == product_id)
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product


def check_category(category_id: int, db: Session) -> Category:
    category = db.get(Category, category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    return category


@router.get("", response_model=ProductListResponse)
def get_all_products(
    search: str | None = Query(default=None, max_length=100),
    category_id: int | None = Query(default=None, gt=0),
    is_active: bool | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    conditions = []

    if search and search.strip():
        value = f"%{search.strip()}%"
        conditions.append(
            or_(
                Product.name.ilike(value),
                Product.brand.ilike(value),
                Product.slug.ilike(value),
            )
        )

    if category_id is not None:
        conditions.append(Product.category_id == category_id)

    if is_active is not None:
        conditions.append(Product.is_active.is_(is_active))

    total = db.scalar(
        select(func.count(Product.id)).where(*conditions)
    ) or 0

    query = (
        select(Product)
        .options(selectinload(Product.category))
        .where(*conditions)
        .order_by(Product.id.desc())
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
def get_admin_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    return find_product(product_id, db)


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
):
    check_category(payload.category_id, db)

    duplicate = db.scalar(
        select(Product).where(Product.slug == payload.slug)
    )

    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product slug already exists",
        )

    product = Product(**payload.model_dump())
    db.add(product)

    try:
        db.commit()
        db.refresh(product)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product could not be created",
        )

    return find_product(product.id, db)


@router.patch(
    "/{product_id}",
    response_model=ProductResponse,
)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
):
    product = find_product(product_id, db)
    changes = payload.model_dump(exclude_unset=True)

    if not changes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields were provided",
        )

    if changes.get("category_id") is not None:
        check_category(changes["category_id"], db)

    if changes.get("slug"):
        duplicate = db.scalar(
            select(Product).where(
                Product.slug == changes["slug"],
                Product.id != product.id,
            )
        )

        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Product slug already exists",
            )

    if (
        "specifications" in changes
        and changes["specifications"] is None
    ):
        changes["specifications"] = {}

    for field, value in changes.items():
        setattr(product, field, value)

    try:
        db.commit()
        db.refresh(product)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product could not be updated",
        )

    return find_product(product.id, db)


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = find_product(product_id, db)

    order_item_count = db.scalar(
        select(func.count())
        .select_from(OrderItem)
        .where(OrderItem.product_id == product.id)
    ) or 0

    if order_item_count:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Product exists in orders; "
                "deactivate it instead"
            ),
        )

    db.delete(product)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product could not be deleted",
        )

    return {"message": "Product deleted successfully"}