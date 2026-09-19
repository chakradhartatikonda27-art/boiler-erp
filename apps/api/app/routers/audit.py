from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.database import get_db
from app.dependencies import get_current_user, RequireRole
from app.models.auth import User
from app.models.audit import AuditLog, SystemSetting, Notification

router = APIRouter(prefix="/audit", tags=["Audit Logs & System Settings"])

@router.get("/logs")
async def get_audit_logs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "MANAGER"]))
):
    res = await db.execute(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(100))
    logs = res.scalars().all()
    return [
        {
            "id": l.id,
            "user_email": l.user_email,
            "action": l.action,
            "module": l.module,
            "record_id": l.record_id,
            "old_value_json": l.old_value_json,
            "new_value_json": l.new_value_json,
            "created_at": l.created_at
        }
        for l in logs
    ]

@router.get("/settings")
async def get_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(SystemSetting))
    return res.scalars().all()
