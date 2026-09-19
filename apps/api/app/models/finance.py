import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from app.database import Base

class Grade(Base):
    __tablename__ = "grades"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(50), unique=True, nullable=False) # A+, A, B+, B, C+, C
    min_fcr = Column(Float, nullable=False)
    max_fcr = Column(Float, nullable=False)
    base_growing_charge_per_kg = Column(Float, nullable=False)
    bonus_per_kg = Column(Float, default=0.0)
    penalty_per_kg = Column(Float, default=0.0)
    effective_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="ACTIVE")

class Incentive(Base):
    __tablename__ = "incentives"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False) # Summer Incentive, Low Mortality Incentive, Rate Bonus
    incentive_type = Column(String(50), nullable=False) # FIXED, PER_BIRD, PER_KG, PERCENTAGE
    rate = Column(Float, nullable=False)
    effective_from = Column(DateTime, default=datetime.utcnow)
    effective_to = Column(DateTime, nullable=True)
    status = Column(String(20), default="ACTIVE")

class GrowingChargeRule(Base):
    __tablename__ = "growing_charge_rules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    version = Column(String(50), nullable=False)
    description = Column(String(255), nullable=True)
    base_gc_per_kg = Column(Float, default=6.50) # Standard base GC rate per kg
    std_fcr_target = Column(Float, default=1.55) # Standard baseline FCR
    fcr_bonus_rate_per_point = Column(Float, default=0.10) # Incentive for FCR lower than target
    fcr_penalty_rate_per_point = Column(Float, default=0.10) # Penalty for FCR higher than target
    std_mortality_target = Column(Float, default=3.0) # Standard mortality target %
    mortality_penalty_rate = Column(Float, default=0.05)
    is_active = Column(String(20), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

class GrowingChargeCalculation(Base):
    __tablename__ = "growing_charge_calculations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    flock_id = Column(String(36), ForeignKey("flocks.id"), nullable=False, unique=True)
    rule_version = Column(String(50), nullable=False)
    calculation_date = Column(DateTime, default=datetime.utcnow)
    
    # Inputs Snapshot
    total_birds_placed = Column(Integer, nullable=False)
    total_birds_lifted = Column(Integer, nullable=False)
    total_weight_lifted_kg = Column(Float, nullable=False)
    total_feed_consumed_kg = Column(Float, nullable=False)
    actual_fcr = Column(Float, nullable=False)
    mortality_percentage = Column(Float, nullable=False)
    assigned_grade = Column(String(50), nullable=False)
    
    # Breakdown Fields
    base_gc_amount = Column(Float, nullable=False)
    fcr_adjustment = Column(Float, default=0.0)
    mortality_adjustment = Column(Float, default=0.0)
    weight_adjustment = Column(Float, default=0.0)
    grade_bonus = Column(Float, default=0.0)
    incentives_amount = Column(Float, default=0.0)
    penalty_amount = Column(Float, default=0.0)
    
    final_gc_amount = Column(Float, nullable=False)
    breakdown_json = Column(Text, nullable=False) # JSON details of formula steps
    
    status = Column(String(20), default="CALCULATED") # CALCULATED, APPROVED, PAID
    approved_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    approval_date = Column(DateTime, nullable=True)

class ExpenseCategory(Base):
    __tablename__ = "expense_categories"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), unique=True, nullable=False) # Fuel, Labour, Maintenance, Feed, Medicine, Electricity, Water, Misc

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    expense_number = Column(String(50), unique=True, nullable=False, index=True)
    expense_date = Column(DateTime, default=datetime.utcnow)
    category_id = Column(String(36), ForeignKey("expense_categories.id"), nullable=False)
    farm_id = Column(String(36), ForeignKey("farms.id"), nullable=True)
    flock_id = Column(String(36), ForeignKey("flocks.id"), nullable=True)
    submitted_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(String(500), nullable=False)
    attachment_url = Column(String(500), nullable=True)
    status = Column(String(30), default="SUBMITTED") # DRAFT, SUBMITTED, APPROVED, REJECTED, PAID

class ExpenseApproval(Base):
    __tablename__ = "expense_approvals"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    expense_id = Column(String(36), ForeignKey("expenses.id"), nullable=False)
    action = Column(String(20), nullable=False) # APPROVED, REJECTED, CORRECTION_REQUESTED
    action_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    action_date = Column(DateTime, default=datetime.utcnow)
    rejection_reason = Column(String(500), nullable=True)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    payment_number = Column(String(50), unique=True, nullable=False, index=True)
    payment_date = Column(DateTime, default=datetime.utcnow)
    payment_type = Column(String(50), nullable=False) # EXPENSE, GROWING_CHARGE, TRADER_REFUND, VENDOR
    reference_id = Column(String(36), nullable=False) # Expense ID, GC ID, Trader ID
    amount = Column(Float, nullable=False)
    payment_mode = Column(String(50), default="BANK_TRANSFER") # BANK_TRANSFER, CHEQUE, CASH
    bank_name = Column(String(100), nullable=True)
    account_number = Column(String(50), nullable=True)
    transaction_reference = Column(String(100), nullable=True)
    status = Column(String(30), default="SUCCESS") # PENDING, PROCESSING, SUCCESS, FAILED
