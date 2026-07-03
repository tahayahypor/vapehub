from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Response,
    status,
)
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies import get_current_admin
from app.models import (
    Category,
    ContactMessage,
    MessageStatus,
    Order,
    OrderStatus,
    Product,
    Review,
    User,
    UserRole,
)
from app.schemas.admin import (
    DashboardResponse,
    UserAdminUpdate,
    UserListResponse,
)
from app.schemas.auth import UserResponse


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


def find_user(user_id: int, db: Session) -> User:
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


def active_admin_count(db: Session) -> int:
    return db.scalar(
        select(func.count(User.id)).where(
            User.role == UserRole.ADMIN,
            User.is_active.is_(True),
        )
    ) or 0


@router.get("/dashboard", response_model=DashboardResponse)
def dashboard(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    total_users = db.scalar(
        select(func.count(User.id))
    ) or 0

    active_users = db.scalar(
        select(func.count(User.id)).where(
            User.is_active.is_(True)
        )
    ) or 0

    total_categories = db.scalar(
        select(func.count(Category.id))
    ) or 0

    total_products = db.scalar(
        select(func.count(Product.id))
    ) or 0

    active_products = db.scalar(
        select(func.count(Product.id)).where(
            Product.is_active.is_(True)
        )
    ) or 0

    total_orders = db.scalar(
        select(func.count(Order.id))
    ) or 0

    pending_orders = db.scalar(
        select(func.count(Order.id)).where(
            Order.status == OrderStatus.PENDING
        )
    ) or 0

    total_revenue = db.scalar(
        select(
            func.coalesce(
                func.sum(Order.total_price),
                0,
            )
        ).where(
            Order.status != OrderStatus.CANCELLED
        )
    ) or 0

    total_reviews = db.scalar(
        select(func.count(Review.id))
    ) or 0

    pending_reviews = db.scalar(
        select(func.count(Review.id)).where(
            Review.is_approved.is_(False)
        )
    ) or 0

    new_messages = db.scalar(
        select(func.count(ContactMessage.id)).where(
            ContactMessage.status == MessageStatus.NEW
        )
    ) or 0

    latest_users = list(
        db.scalars(
            select(User)
            .order_by(User.created_at.desc())
            .limit(5)
        )
    )

    latest_orders = list(
        db.scalars(
            select(Order)
            .order_by(Order.created_at.desc())
            .limit(5)
        )
    )

    return DashboardResponse(
        total_users=total_users,
        active_users=active_users,
        total_categories=total_categories,
        total_products=total_products,
        active_products=active_products,
        total_orders=total_orders,
        pending_orders=pending_orders,
        total_revenue=total_revenue,
        total_reviews=total_reviews,
        pending_reviews=pending_reviews,
        new_messages=new_messages,
        latest_users=latest_users,
        latest_orders=latest_orders,
    )


@router.get("/users", response_model=UserListResponse)
def get_users(
    search: str | None = Query(default=None, max_length=100),
    role: UserRole | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    conditions = []

    if search and search.strip():
        value = f"%{search.strip()}%"
        conditions.append(
            or_(
                User.full_name.ilike(value),
                User.email.ilike(value),
            )
        )

    if role is not None:
        conditions.append(User.role == role)

    if is_active is not None:
        conditions.append(User.is_active.is_(is_active))

    total = db.scalar(
        select(func.count(User.id)).where(*conditions)
    ) or 0

    query = (
        select(User)
        .where(*conditions)
        .order_by(User.created_at.desc())
        .offset(skip)
        .limit(limit)
    )

    return UserListResponse(
        total=total,
        skip=skip,
        limit=limit,
        items=list(db.scalars(query)),
    )


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return find_user(user_id, db)


@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    payload: UserAdminUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = find_user(user_id, db)
    changes = payload.model_dump(exclude_unset=True, exclude_none=True)

    if not changes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields were provided",
        )

    removes_admin_access = (
        user.role == UserRole.ADMIN
        and user.is_active
        and (
            changes.get("role") == UserRole.USER
            or changes.get("is_active") is False
        )
    )

    if removes_admin_access and active_admin_count(db) <= 1:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="At least one active admin is required",
        )

    if user.id == admin.id:
        if changes.get("role") == UserRole.USER:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Admin cannot remove own role",
            )

        if changes.get("is_active") is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Admin cannot deactivate own account",
            )

    new_email = changes.get("email")

    if new_email and new_email != user.email:
        duplicate = db.scalar(
            select(User).where(
                func.lower(User.email) == new_email.lower(),
                User.id != user.id,
            )
        )

        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already registered",
            )

    for field, value in changes.items():
        setattr(user, field, value)

    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User could not be updated",
        )

    return user


@router.delete(
    "/users/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    if user_id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin cannot delete own account",
        )

    user = find_user(user_id, db)

    if (
        user.role == UserRole.ADMIN
        and user.is_active
        and active_admin_count(db) <= 1
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="At least one active admin is required",
        )

    order_count = db.scalar(
        select(func.count(Order.id)).where(
            Order.user_id == user.id
        )
    ) or 0

    if order_count:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "User has orders and cannot be deleted; "
                "deactivate the account instead"
            ),
        )

    db.delete(user)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User could not be deleted",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)