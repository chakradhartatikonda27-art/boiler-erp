from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import (
    auth, dashboard, farmers, flocks, daily_reports,
    inventory, sales, finance, growing_charges, reports, users, audit
)
from app.seed import seed_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize schema tables & seed demo data
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Setup CORS for web frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(farmers.router, prefix=settings.API_V1_STR)
app.include_router(flocks.router, prefix=settings.API_V1_STR)
app.include_router(daily_reports.router, prefix=settings.API_V1_STR)
app.include_router(inventory.router, prefix=settings.API_V1_STR)
app.include_router(sales.router, prefix=settings.API_V1_STR)
app.include_router(finance.router, prefix=settings.API_V1_STR)
app.include_router(growing_charges.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "app": settings.PROJECT_NAME, "version": "1.0.0"}

@app.get("/ready")
async def ready_check():
    return {"status": "ready"}
