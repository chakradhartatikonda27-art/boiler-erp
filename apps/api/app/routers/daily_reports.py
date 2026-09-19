from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.models.auth import User
from app.models.flock import Flock
from app.models.daily import DailyReport, MortalityEntry, CullingEntry
from app.schemas.domain import DailyReportCreate, DailyReportOut

router = APIRouter(prefix="/daily-reports", tags=["Daily Reports & Mortality"])

@router.get("/flock/{flock_id}", response_model=List[DailyReportOut])
async def get_reports_by_flock(
    flock_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(
        select(DailyReport).where(DailyReport.flock_id == flock_id).order_by(DailyReport.report_date.asc())
    )
    return res.scalars().all()

@router.post("", response_model=DailyReportOut)
async def submit_daily_report(
    data: DailyReportCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch flock
    res = await db.execute(select(Flock).where(Flock.id == data.flock_id))
    flock = res.scalars().first()
    if not flock:
        raise HTTPException(status_code=404, detail="Flock not found")
    if flock.status == "CLOSED":
        raise HTTPException(status_code=400, detail="Cannot submit daily reports for a closed flock")

    # Calculate day age
    day_age = (data.report_date - flock.placement_date).days
    if day_age < 0:
        day_age = 0

    opening_birds = flock.current_birds
    closing_birds = opening_birds - data.mortality_count - data.culling_count

    if closing_birds < 0:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid mortality/culling count! Closing birds cannot be negative ({closing_birds}). Opening birds: {opening_birds}"
        )

    feed_kg = (data.feed_consumed_bags * 50.0)
    body_weight_kg = (data.avg_body_weight_g / 1000.0) if data.avg_body_weight_g > 0 else flock.avg_body_weight_kg

    # Calculate current FCR
    total_feed_after = flock.total_feed_consumed_kg + feed_kg
    total_weight_after = closing_birds * body_weight_kg
    calculated_fcr = round(total_feed_after / total_weight_after, 2) if total_weight_after > 0 else 0.0

    # Create Daily Report Record
    report = DailyReport(
        flock_id=data.flock_id,
        report_date=data.report_date,
        day_age=day_age,
        opening_birds=opening_birds,
        mortality_count=data.mortality_count,
        culling_count=data.culling_count,
        birds_lifted_count=0,
        closing_birds=closing_birds,
        feed_consumed_bags=data.feed_consumed_bags,
        feed_consumed_kg=feed_kg,
        feed_type=data.feed_type,
        water_consumption_liters=data.water_consumption_liters,
        avg_body_weight_g=data.avg_body_weight_g,
        fcr=calculated_fcr,
        medicines_used=data.medicines_used,
        vaccination_done=data.vaccination_done,
        remarks=data.remarks,
        submitted_by=current_user.id
    )
    db.add(report)

    # Update Flock aggregates
    flock.current_birds = closing_birds
    flock.total_mortality += data.mortality_count
    flock.total_culling += data.culling_count
    flock.total_feed_consumed_kg += feed_kg
    flock.avg_body_weight_kg = body_weight_kg
    flock.current_fcr = calculated_fcr

    if data.mortality_count > 0:
        m_entry = MortalityEntry(
            flock_id=flock.id,
            entry_date=data.report_date,
            count=data.mortality_count,
            reason_category="General Mortality",
            notes=data.remarks
        )
        db.add(m_entry)

    if data.culling_count > 0:
        c_entry = CullingEntry(
            flock_id=flock.id,
            entry_date=data.report_date,
            count=data.culling_count,
            reason="Weak Bird Culling",
            remarks=data.remarks
        )
        db.add(c_entry)

    await db.commit()
    await db.refresh(report)
    return report
