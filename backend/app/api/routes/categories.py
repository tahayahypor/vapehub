from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies import (
    get_current_admin,
    get_optional_user,
)
from app.models import (
    Category,
    Product,
    User,
    UserRole,
)
from app.schemas.category import (
    CategoryCreate,
    CategoryResponse,
    CategoryUpdate,
)


router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


def find_category(
    category_id: int,
    db: Session,
) -> Category:
    category = db.get(Category, category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    return category


def is_admin(user: User | None) -> bool:
    return bool(
        user and user.role == UserRole.ADMIN
    )


@router.get(
    "",
    response_model=list[CategoryResponse],
)
def get_categories(
    include_inactive: bool = Query(default=False),
    user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    if include_inactive and not is_admin(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    statement = select(Category)

    if not include_inactive:
        statement = statement.where(
            Category.is_active.is_(True)
        )

    statement = statement.order_by(Category.name)

    return list(db.scalars(statement))


@router.get(
    "/{category_id}",
    response_model=CategoryResponse,
)
def get_category(
    category_id: int,
    user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    category = find_category(category_id, db)

    if (
        not category.is_active
        and not is_admin(user)
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    return category


@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    duplicate = db.scalar(
        select(Category).where(
            or_(
                func.lower(Category.name)
                == payload.name.lower(),
                Category.slug == payload.slug,
            )
        )
    )

    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Category name or slug already exists",
        )

    category = Category(
        name=payload.name,
        slug=payload.slug,
    )

    db.add(category)

    try:
        db.commit()
        db.refresh(category)
    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Category name or slug already exists",
        )

    return category


@router.patch(
    "/{category_id}",
    response_model=CategoryResponse,
)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    category = find_category(category_id, db)

    changes = payload.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )

    if not changes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields were provided",
        )

    name = changes.get("name")
    slug = changes.get("slug")

    if name or slug:
        conditions = []

        if name:
            conditions.append(
                func.lower(Category.name)
                == name.lower()
            )

        if slug:
            conditions.append(
                Category.slug == slug
            )

        duplicate = db.scalar(
            select(Category).where(
                Category.id != category.id,
                or_(*conditions),
            )
        )

        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Category name or slug "
                    "already exists"
                ),
            )

    for field, value in changes.items():
        setattr(category, field, value)

    try:
        db.commit()
        db.refresh(category)
    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Category could not be updated",
        )

    return category


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    category = find_category(category_id, db)

    product_count = db.scalar(
        select(func.count())
        .select_from(Product)
        .where(
            Product.category_id == category.id
        )
    ) or 0

    if product_count:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Deactivate the category because "
                "it contains products"
            ),
        )

    db.delete(category)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Category could not be deleted",
        )

    return {
        "message": "Category deleted successfully",
    }