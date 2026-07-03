from fastapi import Depends, FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import get_db
from app.api.router import api_router

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
)

ALLOWED_ORIGINS = {
    settings.frontend_url.rstrip("/"),
    "https://vapehub-4gi8.vercel.app",
    "http://localhost:5173",
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(ALLOWED_ORIGINS),
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=[
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
],
)

@app.middleware("http")
async def force_cors_headers(request: Request, call_next):
    origin = request.headers.get("origin")
    response = await call_next(request)

    if origin and (
        origin in ALLOWED_ORIGINS
        or origin.endswith(".vercel.app")
    ):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept, Origin"
        response.headers["Vary"] = "Origin"

    return response

@app.options("/{full_path:path}")
def preflight(full_path: str, request: Request):
    origin = request.headers.get("origin", "")
    response = Response(status_code=204)

    if origin and (
        origin in ALLOWED_ORIGINS
        or origin.endswith(".vercel.app")
    ):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Vary"] = "Origin"

    return response

app.include_router(api_router)

@app.get("/api/health", tags=["Health"])
def health_check(
    db: Session = Depends(get_db),
):
    db.execute(text("SELECT 1"))

    return {
        "status": "ok",
        "database": "connected",
    }