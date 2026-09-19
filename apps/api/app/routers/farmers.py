from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import random

from app.database import get_db
from app.dependencies import get_current_user, RequireRole
from app.models.auth import User
from app.models.farmer import Farmer, Farm, Shed
from app.schemas.domain import FarmerCreate, FarmerOut, FarmCreate, FarmOut, ShedCreate

router = APIRouter(prefix="/farmers", tags=["Farmers"])

@router.get("", response_model=List[FarmerOut])
async def list_farmers(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Farmer).order_by(Farmer.created_at.desc()))
    return result.scalars().all()

@router.post("", response_model=FarmerOut)
async def create_farmer(
    data: FarmerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "MANAGER"]))
):
    # Generate automatic farmer code like AP-VSP-00042
    state_prefix = data.state[:2].upper() if data.state else "IN"
    dist_prefix = data.district[:3].upper() if data.district else "GEN"
    rand_num = random.randint(10000, 99999)
    farmer_code = f"{state_prefix}-{dist_prefix}-{rand_num}"

    farmer = Farmer(
        farmer_code=farmer_code,
        full_name=data.full_name,
        mobile=data.mobile,
        address=data.address,
        state=data.state,
        district=data.district,
        mandal=data.mandal,
        village=data.village,
        branch_id=data.branch_id,
        bank_name=data.bank_name,
        bank_account_no=data.bank_account_no,
        ifsc_code=data.ifsc_code
    )
    db.add(farmer)
    await db.commit()
    await db.refresh(farmer)
    return farmer

@router.post("/{farmer_id}/farms", response_model=FarmOut)
async def create_farm_for_farmer(
    farmer_id: str,
    data: FarmCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "MANAGER"]))
):
    farmer_res = await db.execute(select(Farmer).where(Farmer.id == farmer_id))
    farmer = farmer_res.scalars().first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    rand_num = random.randint(100, 999)
    farm_code = f"FARM-{farmer.farmer_code}-{rand_num}"
    
    total_capacity = sum(s.capacity for s in data.sheds) if data.sheds else 5000

    farm = Farm(
        farm_code=farm_code,
        farm_name=data.farm_name,
        farmer_id=farmer_id,
        area_id=data.area_id,
        supervisor_id=data.supervisor_id or current_user.id,
        total_capacity=total_capacity,
        gps_latitude=data.gps_latitude,
        gps_longitude=data.gps_longitude
    )
    db.add(farm)
    await db.flush()

    for s in data.sheds:
        shed = Shed(
            farm_id=farm.id,
            shed_number=s.shed_number,
            capacity=s.capacity,
            area_sqft=s.area_sqft
        )
        db.add(shed)

    await db.commit()
    await db.refresh(farm)
    return farm
