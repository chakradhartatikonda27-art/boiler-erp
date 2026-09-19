from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.dependencies import get_current_user
from app.models.auth import User
from app.models.flock import Flock
from app.models.daily import DailyReport
from app.models.sales import Sale, BirdLifting
from app.models.finance import Expense, GrowingChargeCalculation

router = APIRouter(prefix="/reports", tags=["Exportable Reports"])

@router.get("/production")
async def get_production_report(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    flocks_res = await db.execute(select(Flock))
    flocks = flocks_res.scalars().all()
    return [
        {
            "flock_code": f.flock_code,
            "batch_number": f.batch_number,
            "placed_quantity": f.placed_quantity,
            "current_birds": f.current_birds,
            "total_mortality": f.total_mortality,
            "total_culling": f.total_culling,
            "total_feed_consumed_kg": f.total_feed_consumed_kg,
            "current_fcr": f.current_fcr,
            "avg_body_weight_kg": f.avg_body_weight_kg,
            "status": f.status
        }
        for f in flocks
    ]

@router.get("/sales")
async def get_sales_report(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sales_res = await db.execute(select(Sale))
    sales = sales_res.scalars().all()
    return [
        {
            "invoice_number": s.invoice_number,
            "sale_date": s.sale_date,
            "total_birds": s.total_birds,
            "total_weight_kg": s.total_weight_kg,
            "rate_per_kg": s.rate_per_kg,
            "subtotal": s.subtotal,
            "final_amount": s.final_amount,
            "payment_status": s.payment_status
        }
        for s in sales
    ]

@router.get("/finance")
async def get_finance_report(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exp_res = await db.execute(select(Expense))
    expenses = exp_res.scalars().all()
    gc_res = await db.execute(select(GrowingChargeCalculation))
    gcs = gc_res.scalars().all()

    return {
        "total_expenses_submitted": sum(e.amount for e in expenses),
        "total_expenses_approved": sum(e.amount for e in expenses if e.status == "APPROVED"),
        "total_gc_payable": sum(g.final_gc_amount for g in gcs if g.status == "APPROVED"),
        "expense_breakdown": [
            {
                "expense_number": e.expense_number,
                "amount": e.amount,
                "description": e.description,
                "status": e.status,
                "expense_date": e.expense_date
            }
            for e in expenses
        ]
    }
