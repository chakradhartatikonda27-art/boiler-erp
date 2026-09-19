from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.database import get_db
from app.dependencies import get_current_user, RequireRole, get_password_hash
from app.models.auth import User, UserAssignment
from app.schemas.auth import UserOut, UserCreate

router = APIRouter(prefix="/users", tags=["Users & Role Administration"])

@router.get("", response_model=List[UserOut])
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "MANAGER"]))
):
    res = await db.execute(select(User))
    return res.scalars().all()

@router.post("", response_model=UserOut)
async def create_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN"]))
):
    exist = await db.execute(select(User).where(User.email == data.email))
    if exist.scalars().first():
        raise HTTPException(status_code=400, detail="User with this email already exists")

    user = User(
        email=data.email,
        full_name=data.full_name,
        hashed_password=get_password_hash(data.password),
        role=data.role,
        mobile=data.mobile,
        is_active=True
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
