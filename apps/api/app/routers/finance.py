from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from datetime import datetime
import random

from app.database import get_db
from app.dependencies import get_current_user, RequireRole
from app.models.auth import User
from app.models.finance import ExpenseCategory, Expense, ExpenseApproval, Payment
from app.schemas.domain import ExpenseCreate, ExpenseOut, ExpenseApprovalCreate

router = APIRouter(prefix="/finance", tags=["Finance & Expenses"])

@router.get("/categories")
async def list_expense_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(ExpenseCategory))
    return res.scalars().all()

@router.get("/expenses", response_model=List[ExpenseOut])
async def list_expenses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(Expense).order_by(Expense.expense_date.desc()))
    return res.scalars().all()

@router.post("/expenses", response_model=ExpenseOut)
async def submit_expense(
    data: ExpenseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rand_num = random.randint(10000, 99999)
    exp_num = f"EXP-{rand_num}"

    expense = Expense(
        expense_number=exp_num,
        category_id=data.category_id,
        farm_id=data.farm_id,
        flock_id=data.flock_id,
        submitted_by=current_user.id,
        amount=data.amount,
        description=data.description,
        status="SUBMITTED"
    )
    db.add(expense)
    await db.commit()
    await db.refresh(expense)
    return expense

@router.post("/expenses/{expense_id}/approve")
async def approve_or_reject_expense(
    expense_id: str,
    data: ExpenseApprovalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "MANAGER", "ACCOUNTANT"]))
):
    res = await db.execute(select(Expense).where(Expense.id == expense_id))
    expense = res.scalars().first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense record not found")

    # Prevent self-approval if supervisor submitted it and is trying to approve (unless ADMIN)
    if expense.submitted_by == current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="You cannot approve your own expense submission!")

    expense.status = data.action # APPROVED or REJECTED

    approval = ExpenseApproval(
        expense_id=expense.id,
        action=data.action,
        action_by=current_user.id,
        rejection_reason=data.rejection_reason
    )
    db.add(approval)

    # If approved, create Payment entry
    if data.action == "APPROVED":
        pay_num = f"PAY-{random.randint(10000, 99999)}"
        payment = Payment(
            payment_number=pay_num,
            payment_type="EXPENSE",
            reference_id=expense.id,
            amount=expense.amount,
            status="PENDING"
        )
        db.add(payment)

    await db.commit()
    return {"status": "SUCCESS", "message": f"Expense {expense.expense_number} marked as {data.action}."}
