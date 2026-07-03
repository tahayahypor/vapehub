from fastapi import APIRouter

from app.api.routes.admin import router as admin_router
from app.api.routes.auth import router as auth_router
from app.api.routes.categories import router as categories_router
from app.api.routes.products import router as products_router
from app.api.routes.admin_products import (
    router as admin_products_router,
)
from app.api.routes.orders import router as orders_router
from app.api.routes.admin_orders import (
    router as admin_orders_router,
)
from app.api.routes.contact import router as contact_router
from app.api.routes.reviews import router as reviews_router
from app.api.routes.admin_contact import (
    router as admin_contact_router,
)
from app.api.routes.admin_reviews import (
    router as admin_reviews_router,
)

api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(admin_router)
api_router.include_router(categories_router)
api_router.include_router(products_router)
api_router.include_router(admin_products_router)
api_router.include_router(orders_router)
api_router.include_router(admin_orders_router)
api_router.include_router(reviews_router)
api_router.include_router(contact_router)
api_router.include_router(admin_reviews_router)
api_router.include_router(admin_contact_router)