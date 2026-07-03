from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies import get_current_user
from app.models import Product, Review, User
from app.schemas.interactions import (
    ReviewCreate,
    ReviewResponse,
)


router = APIRouter(tags=["Reviews"])


@router.get(
    "/products/{product_id}/reviews",
    response_model=list[ReviewResponse],
)
def get_product_reviews(
    product_id: int,
    db: Session = Depends(get_db),
):
    if not db.get(Product, product_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return list(
        db.scalars(
            select(Review)
            .where(
                Review.product_id == product_id,
                Review.is_approved.is_(True),
            )
            .order_by(Review.id.desc())
        )
    )


@router.post(
    "/products/{product_id}/reviews",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_review(
    product_id: int,
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    product = db.get(Product, product_id)

    if not product or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    review = Review(
        user_id=user.id,
        product_id=product.id,
        rating=payload.rating,
        comment=payload.comment,
    )

    db.add(review)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already reviewed this product",
        )

    db.refresh(review)

    return review


@router.delete("/reviews/{review_id}")
def delete_my_review(
    review_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    review = db.get(Review, review_id)

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    if review.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot delete this review",
        )

    db.delete(review)
    db.commit()

    return {"message": "Review deleted successfully"}