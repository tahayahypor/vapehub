from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies import get_current_admin
from app.models import Review
from app.schemas.interactions import (
    ReviewApprovalUpdate,
    ReviewResponse,
)


router = APIRouter(
    prefix="/admin/reviews",
    tags=["Admin Reviews"],
    dependencies=[Depends(get_current_admin)],
)


def find_review(
    review_id: int,
    db: Session,
) -> Review:
    review = db.get(Review, review_id)

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    return review


@router.get(
    "",
    response_model=list[ReviewResponse],
)
def get_all_reviews(
    approved: bool | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = select(Review).order_by(Review.id.desc())

    if approved is not None:
        query = query.where(
            Review.is_approved.is_(approved)
        )

    return list(db.scalars(query))


@router.patch(
    "/{review_id}",
    response_model=ReviewResponse,
)
def approve_review(
    review_id: int,
    payload: ReviewApprovalUpdate,
    db: Session = Depends(get_db),
):
    review = find_review(review_id, db)
    review.is_approved = payload.is_approved

    db.commit()
    db.refresh(review)

    return review


@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
):
    review = find_review(review_id, db)

    db.delete(review)
    db.commit()

    return {
        "message": "Review deleted successfully",
    }