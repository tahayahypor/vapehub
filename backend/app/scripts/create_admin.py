import sys

from sqlalchemy import func, select

from app.database.session import SessionLocal
from app.models import User, UserRole


def main() -> None:
    if len(sys.argv) != 2:
        print(
            "Usage: python -m app.scripts.create_admin email"
        )
        return

    email = sys.argv[1].lower().strip()

    with SessionLocal() as db:
        user = db.scalar(
            select(User).where(
                func.lower(User.email) == email
            )
        )

        if not user:
            print("User not found")
            return

        user.role = UserRole.ADMIN
        user.is_active = True
        db.commit()

        print(f"{email} is now an admin")


if __name__ == "__main__":
    main()