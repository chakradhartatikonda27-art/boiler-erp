from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.dependencies import get_current_user
from app.models.auth import User
from app.models.farmer import Farm, Farmer
from app.models.flock import Flock
from app.models.daily import DailyReport
from app.models.sales import BirdLifting, Sale, Trader
from app.models.finance import Expense, GrowingChargeCalculation
from app.models.inventory import FeedTransaction, MedicineBatch

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("")
async def get_dashboard_kpis(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns real-time dashboard analytics calculated directly from SQL queries.
    """
    # 1. Active Flocks & Bird Metrics
    flocks_res = await db.execute(select(Flock).where(Flock.status != "CLOSED"))
    active_flocks = flocks_res.scalars().all()
    
    total_birds_housed = sum(f.placed_quantity for f in active_flocks)
    total_birds_available = sum(f.current_birds for f in active_flocks)
    
    sold_birds_res = await db.execute(select(func.coalesce(func.sum(BirdLifting.birds_count), 0)))
    total_birds_sold = sold_birds_res.scalar()

    # 2. Total Farms count
    farms_count_res = await db.execute(select(func.count(Farm.id)))
    total_farms = farms_count_res.scalar()

    # 3. Expenses & Financials
    pending_exp_res = await db.execute(
        select(func.coalesce(func.sum(Expense.amount), 0.0)).where(Expense.status == "SUBMITTED")
    )
    pending_expenses_amount = pending_exp_res.scalar()

    gc_payable_res = await db.execute(
        select(func.coalesce(func.sum(GrowingChargeCalculation.final_gc_amount), 0.0))
        .where(GrowingChargeCalculation.status == "APPROVED")
    )
    gc_payable_amount = gc_payable_res.scalar()

    trader_balance_res = await db.execute(select(func.coalesce(func.sum(Trader.current_balance), 0.0)))
    total_trader_receivables = trader_balance_res.scalar()

    # 4. Feed & Medicine Stock
    feed_stock_res = await db.execute(
        select(func.coalesce(func.sum(FeedTransaction.quantity_bags), 0.0))
    )
    total_feed_stock_bags = feed_stock_res.scalar()

    # 5. Age-Wise Available Birds Breakdown
    age_buckets = {"35d": 0, "36d": 0, "37d": 0, "38d": 0, "39d": 0, "40+d": 0}
    now = datetime.utcnow()
    for flock in active_flocks:
        age_days = (now - flock.placement_date).days
        if age_days >= 40:
            age_buckets["40+d"] += flock.current_birds
        elif age_days == 39:
            age_buckets["39d"] += flock.current_birds
        elif age_days == 38:
            age_buckets["38d"] += flock.current_birds
        elif age_days == 37:
            age_buckets["37d"] += flock.current_birds
        elif age_days == 36:
            age_buckets["36d"] += flock.current_birds
        elif age_days >= 35:
            age_buckets["35d"] += flock.current_birds

    return {
        "kpis": {
            "total_birds_housed": total_birds_housed,
            "total_birds_sold": total_birds_sold,
            "total_birds_available": total_birds_available,
            "total_farms": total_farms,
            "active_flocks_count": len(active_flocks),
            "total_feed_stock_bags": total_feed_stock_bags,
            "pending_expenses_amount": pending_expenses_amount,
            "gc_payable_amount": gc_payable_amount,
            "total_trader_receivables": total_trader_receivables
        },
        "birds_overview": {
            "housed": total_birds_housed,
            "sold": total_birds_sold,
            "available": total_birds_available
        },
        "age_wise_available": age_buckets
    }
