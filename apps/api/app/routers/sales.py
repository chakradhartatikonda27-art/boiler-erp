from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from datetime import datetime
import random

from app.database import get_db
from app.dependencies import get_current_user, RequireRole
from app.models.auth import User
from app.models.sales import Trader, TraderLedger, BirdLifting, Sale
from app.models.flock import Flock
from app.models.farmer import Farm
from app.schemas.domain import TraderCreate, TraderOut, BirdLiftingCreate, BirdLiftingOut

router = APIRouter(prefix="/sales", tags=["Sales & Bird Lifting"])

@router.get("/traders", response_model=List[TraderOut])
async def list_traders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(Trader).order_by(Trader.trader_name.asc()))
    return res.scalars().all()

@router.post("/traders", response_model=TraderOut)
async def create_trader(
    data: TraderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "MANAGER", "ACCOUNTANT"]))
):
    rand_num = random.randint(1000, 9999)
    trader_code = f"TRD-{rand_num}"

    trader = Trader(
        trader_code=trader_code,
        trader_name=data.trader_name,
        mobile=data.mobile,
        address=data.address,
        gst_number=data.gst_number,
        credit_limit=data.credit_limit,
        current_balance=0.0
    )
    db.add(trader)
    await db.commit()
    await db.refresh(trader)
    return trader

@router.get("/birds/available")
async def get_available_birds(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Query flocks eligible for lifting (>= 35 days old).
    """
    res = await db.execute(select(Flock).where(Flock.status.in_(["ACTIVE", "READY_FOR_LIFTING", "PARTIALLY_LIFTED"])))
    flocks = res.scalars().all()

    now = datetime.utcnow()
    results = []
    for f in flocks:
        age_days = (now - f.placement_date).days
        if age_days >= 35 and f.current_birds > 0:
            farm_res = await db.execute(select(Farm).where(Farm.id == f.farm_id))
            farm = farm_res.scalars().first()
            results.append({
                "flock_id": f.id,
                "flock_code": f.flock_code,
                "batch_number": f.batch_number,
                "farm_name": farm.farm_name if farm else "Unknown",
                "age_days": age_days,
                "available_birds": f.current_birds,
                "avg_body_weight_kg": f.avg_body_weight_kg,
                "status": f.status
            })
    return results

@router.post("/lifting", response_model=BirdLiftingOut)
async def record_bird_lifting(
    data: BirdLiftingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "MANAGER", "SUPERVISOR", "ACCOUNTANT"]))
):
    # Verify Flock
    flock_res = await db.execute(select(Flock).where(Flock.id == data.flock_id))
    flock = flock_res.scalars().first()
    if not flock:
        raise HTTPException(status_code=404, detail="Flock not found")
    if data.birds_count > flock.current_birds:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot lift {data.birds_count} birds. Only {flock.current_birds} birds available in this flock!"
        )

    # Verify Trader
    trader_res = await db.execute(select(Trader).where(Trader.id == data.trader_id))
    trader = trader_res.scalars().first()
    if not trader:
        raise HTTPException(status_code=404, detail="Trader not found")

    # Weight and Cost Validation
    net_weight = data.gross_weight_kg - data.tare_weight_kg
    if net_weight <= 0:
        raise HTTPException(status_code=400, detail="Net weight must be greater than zero")

    avg_bird_weight = round(net_weight / data.birds_count, 2)
    total_amount = round(net_weight * data.rate_per_kg, 2)

    rand_num = random.randint(10000, 99999)
    lifting_number = f"LFT-{rand_num}"

    lifting = BirdLifting(
        lifting_number=lifting_number,
        trader_id=data.trader_id,
        farm_id=data.farm_id,
        flock_id=data.flock_id,
        vehicle_number=data.vehicle_number,
        supervisor_id=current_user.id,
        gross_weight_kg=data.gross_weight_kg,
        tare_weight_kg=data.tare_weight_kg,
        net_weight_kg=net_weight,
        birds_count=data.birds_count,
        avg_bird_weight_kg=avg_bird_weight,
        rate_per_kg=data.rate_per_kg,
        total_amount=total_amount,
        remarks=data.remarks
    )
    db.add(lifting)

    # Update Flock Counts
    flock.current_birds -= data.birds_count
    flock.total_lifted += data.birds_count
    if flock.current_birds == 0:
        flock.status = "CLOSED"
        flock.closed_at = datetime.utcnow()
    else:
        flock.status = "PARTIALLY_LIFTED"

    # Create Trader Ledger Debit Entry
    new_balance = trader.current_balance + total_amount
    trader.current_balance = new_balance

    ledger_entry = TraderLedger(
        trader_id=trader.id,
        transaction_type="SALE_DEBIT",
        reference_number=lifting_number,
        debit_amount=total_amount,
        credit_amount=0.0,
        running_balance=new_balance,
        remarks=f"Bird Lifting {lifting_number} - {data.birds_count} birds"
    )
    db.add(ledger_entry)

    # Create Sale Invoice Record
    inv_number = f"INV-{rand_num}"
    sale = Sale(
        invoice_number=inv_number,
        lifting_id=lifting.id,
        trader_id=trader.id,
        total_birds=data.birds_count,
        total_weight_kg=net_weight,
        rate_per_kg=data.rate_per_kg,
        subtotal=total_amount,
        tax_amount=0.0,
        final_amount=total_amount,
        payment_status="UNPAID"
    )
    db.add(sale)

    await db.commit()
    await db.refresh(lifting)
    return lifting
