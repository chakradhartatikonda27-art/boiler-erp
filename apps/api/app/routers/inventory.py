from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta

from app.database import get_db
from app.dependencies import get_current_user, RequireRole
from app.models.auth import User
from app.models.inventory import FeedType, FeedLocation, FeedTransaction, Medicine, MedicineBatch, MedicineTransaction
from app.schemas.domain import FeedTypeCreate, FeedTransferCreate

router = APIRouter(prefix="/inventory", tags=["Inventory & Feed/Medicine"])

@router.get("/feed/types")
async def list_feed_types(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(FeedType))
    return res.scalars().all()

@router.post("/feed/types")
async def create_feed_type(
    data: FeedTypeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "MANAGER"]))
):
    ft = FeedType(**data.model_dump())
    db.add(ft)
    await db.commit()
    await db.refresh(ft)
    return ft

@router.get("/feed/locations")
async def list_feed_locations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(FeedLocation))
    return res.scalars().all()

@router.post("/feed/transfer")
async def transfer_feed_stock(
    data: FeedTransferCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "MANAGER", "SUPERVISOR"]))
):
    # Verify Feed Type
    ft_res = await db.execute(select(FeedType).where(FeedType.id == data.feed_type_id))
    ft = ft_res.scalars().first()
    if not ft:
        raise HTTPException(status_code=404, detail="Feed type not found")

    total_kg = data.quantity_bags * ft.bag_weight_kg
    total_cost = total_kg * ft.cost_per_kg

    # 1. OUT Transaction from Source
    txn_out = FeedTransaction(
        transaction_type="TRANSFER_OUT",
        feed_type_id=data.feed_type_id,
        location_id=data.source_location_id,
        flock_id=data.flock_id,
        quantity_bags=-data.quantity_bags,
        quantity_kg=-total_kg,
        unit_cost=ft.cost_per_kg,
        total_cost=total_cost,
        source_location_id=data.source_location_id,
        destination_location_id=data.destination_location_id,
        remarks=data.remarks
    )
    db.add(txn_out)

    # 2. IN Transaction to Destination
    txn_in = FeedTransaction(
        transaction_type="TRANSFER_IN",
        feed_type_id=data.feed_type_id,
        location_id=data.destination_location_id,
        flock_id=data.flock_id,
        quantity_bags=data.quantity_bags,
        quantity_kg=total_kg,
        unit_cost=ft.cost_per_kg,
        total_cost=total_cost,
        source_location_id=data.source_location_id,
        destination_location_id=data.destination_location_id,
        remarks=data.remarks
    )
    db.add(txn_in)

    await db.commit()
    return {"status": "SUCCESS", "message": f"Transferred {data.quantity_bags} bags of {ft.name} successfully."}

@router.get("/medicines/batches")
async def list_medicine_batches(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(MedicineBatch))
    batches = res.scalars().all()

    now = datetime.utcnow()
    thirty_days_later = now + timedelta(days=30)

    result = []
    for b in batches:
        status_label = "ACTIVE"
        if b.expiry_date < now:
            status_label = "EXPIRED"
        elif b.expiry_date < thirty_days_later:
            status_label = "EXPIRING_SOON"

        result.append({
            "id": b.id,
            "medicine_id": b.medicine_id,
            "batch_number": b.batch_number,
            "expiry_date": b.expiry_date,
            "quantity_available": b.quantity_available,
            "unit_cost": b.unit_cost,
            "supplier_name": b.supplier_name,
            "status": status_label
        })
    return result
