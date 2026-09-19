import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Trader(Base):
    __tablename__ = "traders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    trader_code = Column(String(50), unique=True, nullable=False, index=True)
    trader_name = Column(String(255), nullable=False)
    mobile = Column(String(20), nullable=False)
    address = Column(String(500), nullable=True)
    gst_number = Column(String(50), nullable=True)
    credit_limit = Column(Float, default=500000.0)
    current_balance = Column(Float, default=0.0) # Positive means Trader owes us, Negative means Overpaid/Advance
    status = Column(String(20), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

    ledgers = relationship("TraderLedger", back_populates="trader", cascade="all, delete-orphan")

class TraderLedger(Base):
    __tablename__ = "trader_ledgers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    trader_id = Column(String(36), ForeignKey("traders.id"), nullable=False, index=True)
    entry_date = Column(DateTime, default=datetime.utcnow, index=True)
    transaction_type = Column(String(50), nullable=False) # SALE_DEBIT, PAYMENT_CREDIT, ADJUSTMENT, REFUND
    reference_number = Column(String(100), nullable=True)
    debit_amount = Column(Float, default=0.0)
    credit_amount = Column(Float, default=0.0)
    running_balance = Column(Float, nullable=False)
    remarks = Column(String(500), nullable=True)

    trader = relationship("Trader", back_populates="ledgers")

class BirdLifting(Base):
    __tablename__ = "bird_liftings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lifting_number = Column(String(50), unique=True, nullable=False, index=True)
    lifting_date = Column(DateTime, default=datetime.utcnow, index=True)
    trader_id = Column(String(36), ForeignKey("traders.id"), nullable=False)
    farm_id = Column(String(36), ForeignKey("farms.id"), nullable=False)
    flock_id = Column(String(36), ForeignKey("flocks.id"), nullable=False)
    
    vehicle_number = Column(String(50), nullable=False)
    supervisor_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    
    gross_weight_kg = Column(Float, nullable=False)
    tare_weight_kg = Column(Float, nullable=False)
    net_weight_kg = Column(Float, nullable=False) # Gross - Tare
    birds_count = Column(Integer, nullable=False)
    avg_bird_weight_kg = Column(Float, nullable=False) # Net Weight / Birds
    
    rate_per_kg = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False) # Net Weight * Rate
    remarks = Column(String(500), nullable=True)

class Sale(Base):
    __tablename__ = "sales"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    invoice_number = Column(String(50), unique=True, nullable=False, index=True)
    sale_date = Column(DateTime, default=datetime.utcnow)
    lifting_id = Column(String(36), ForeignKey("bird_liftings.id"), nullable=False)
    trader_id = Column(String(36), ForeignKey("traders.id"), nullable=False)
    total_birds = Column(Integer, nullable=False)
    total_weight_kg = Column(Float, nullable=False)
    rate_per_kg = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    final_amount = Column(Float, nullable=False)
    payment_status = Column(String(20), default="UNPAID") # UNPAID, PARTIAL, PAID
