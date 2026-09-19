from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import random

from app.database import get_db
from app.dependencies import get_current_user, RequireRole
from app.models.auth import User
from app.models.flock import Flock, Hatchery, ChickPurchase
from app.schemas.domain import HatcheryCreate, HatcheryOut, FlockPlacementCreate, FlockOut

router = APIRouter(prefix="/flocks", tags=["Flocks & Hatcheries"])

@router.get("/hatcheries", response_model=List[HatcheryOut])
async def list_hatcheries(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(Hatchery))
    return res.scalars().all()

@router.post("/hatcheries", response_model=HatcheryOut)
async def create_hatchery(
    data: HatcheryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "MANAGER"]))
):
    hatchery = Hatchery(**data.model_dump())
    db.add(hatchery)
    await db.commit()
    await db.refresh(hatchery)
    return hatchery

@router.get("/chick-purchases")
async def list_chick_purchases(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(ChickPurchase).order_by(ChickPurchase.purchase_date.desc()))
    purchases = res.scalars().all()
    result = []
    for p in purchases:
        h_res = await db.execute(select(Hatchery).where(Hatchery.id == p.hatchery_id))
        hatchery = h_res.scalars().first()
        result.append({
            "id": p.id,
            "purchase_date": p.purchase_date,
            "invoice_number": p.invoice_number,
            "batch_number": p.batch_number,
            "hatchery_name": hatchery.name if hatchery else "Unknown",
            "quantity": p.quantity,
            "chick_cost": p.chick_cost,
            "transport_cost": p.transport_cost,
            "vaccination_cost": p.vaccination_cost,
            "total_cost": p.total_cost
        })
    return result

@router.post("/chick-purchases")
async def create_chick_purchase(
    batch_number: str,
    hatchery_id: str,
    quantity: int,
    chick_cost: float,
    transport_cost: float = 0.0,
    vaccination_cost: float = 0.0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "MANAGER"]))
):
    inv_num = f"INV-CH-{random.randint(10000, 99999)}"
    total_cost = (quantity * chick_cost) + transport_cost + vaccination_cost

    cp = ChickPurchase(
        invoice_number=inv_num,
        batch_number=batch_number,
        hatchery_id=hatchery_id,
        quantity=quantity,
        chick_cost=chick_cost,
        transport_cost=transport_cost,
        vaccination_cost=vaccination_cost,
        total_cost=total_cost
    )
    db.add(cp)
    await db.commit()
    await db.refresh(cp)
    return cp

@router.get("", response_model=List[FlockOut])
async def list_flocks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(Flock).order_by(Flock.placement_date.desc()))
    return res.scalars().all()

@router.post("/place", response_model=FlockOut)
async def place_flock(
    data: FlockPlacementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "MANAGER"]))
):
    rand_num = random.randint(1000, 9999)
    flock_code = f"FLK-{rand_num}"

    flock = Flock(
        flock_code=flock_code,
        batch_number=data.batch_number,
        farm_id=data.farm_id,
        shed_id=data.shed_id,
        hatchery_id=data.hatchery_id,
        supervisor_id=data.supervisor_id or current_user.id,
        placement_date=data.placement_date,
        breed=data.breed,
        placed_quantity=data.placed_quantity,
        chick_cost_per_unit=data.chick_cost_per_unit,
        current_birds=data.placed_quantity,
        total_mortality=0,
        total_culling=0,
        total_lifted=0,
        total_feed_consumed_kg=0.0,
        avg_body_weight_kg=0.04, # Chick initial body weight ~40g
        current_fcr=0.0,
        status="ACTIVE"
    )
    db.add(flock)
    await db.commit()
    await db.refresh(flock)
    return flock
