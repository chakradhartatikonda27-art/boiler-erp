from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user, RequireRole
from app.models.auth import User
from app.models.flock import Flock
from app.models.finance import GrowingChargeRule, GrowingChargeCalculation
from app.schemas.domain import GrowingChargeRuleCreate, GrowingChargeCalculationOut
from app.services.gc_engine import GrowingChargeEngine

router = APIRouter(prefix="/growing-charges", tags=["Growing Charges Engine"])

@router.get("/rules")
async def list_rules(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(GrowingChargeRule))
    return res.scalars().all()

@router.post("/rules")
async def create_rule(
    data: GrowingChargeRuleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN"]))
):
    rule = GrowingChargeRule(**data.model_dump())
    db.add(rule)
    await db.commit()
    await db.refresh(rule)
    return rule

@router.get("/calculations", response_model=List[GrowingChargeCalculationOut])
async def list_calculations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(GrowingChargeCalculation).order_by(GrowingChargeCalculation.calculation_date.desc()))
    return res.scalars().all()

@router.post("/flock/{flock_id}/calculate", response_model=GrowingChargeCalculationOut)
async def calculate_growing_charge(
    flock_id: str,
    assigned_grade: str = "A",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "MANAGER", "ACCOUNTANT"]))
):
    # Fetch Flock
    flock_res = await db.execute(select(Flock).where(Flock.id == flock_id))
    flock = flock_res.scalars().first()
    if not flock:
        raise HTTPException(status_code=404, detail="Flock not found")

    # Fetch Active Rule
    rule_res = await db.execute(select(GrowingChargeRule).where(GrowingChargeRule.is_active == "ACTIVE"))
    rule = rule_res.scalars().first()
    if not rule:
        # Fallback default rule
        rule = GrowingChargeRule(
            version="v1.0-STD",
            base_gc_per_kg=6.50,
            std_fcr_target=1.55,
            std_mortality_target=3.0
        )

    calc_dict = GrowingChargeEngine.calculate(flock=flock, rule=rule, assigned_grade=assigned_grade)

    # Check existing calculation
    exist_res = await db.execute(select(GrowingChargeCalculation).where(GrowingChargeCalculation.flock_id == flock_id))
    calc = exist_res.scalars().first()

    if calc:
        for k, v in calc_dict.items():
            setattr(calc, k, v)
        calc.calculation_date = datetime.utcnow()
    else:
        calc = GrowingChargeCalculation(flock_id=flock_id, **calc_dict)
        db.add(calc)

    await db.commit()
    await db.refresh(calc)
    return calc

@router.post("/{calc_id}/approve")
async def approve_growing_charge(
    calc_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "ACCOUNTANT"]))
):
    res = await db.execute(select(GrowingChargeCalculation).where(GrowingChargeCalculation.id == calc_id))
    calc = res.scalars().first()
    if not calc:
        raise HTTPException(status_code=404, detail="Growing charge calculation not found")

    calc.status = "APPROVED"
    calc.approved_by = current_user.id
    calc.approval_date = datetime.utcnow()

    await db.commit()
    return {"status": "SUCCESS", "message": f"Growing Charge for flock approved: ₹{calc.final_gc_amount}"}
