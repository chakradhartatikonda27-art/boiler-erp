import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Hatchery(Base):
    __tablename__ = "hatcheries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    contact_person = Column(String(100), nullable=True)
    mobile = Column(String(20), nullable=True)
    address = Column(String(500), nullable=True)
    gst_number = Column(String(50), nullable=True)
    status = Column(String(20), default="ACTIVE")

class ChickPurchase(Base):
    __tablename__ = "chick_purchases"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    purchase_date = Column(DateTime, default=datetime.utcnow)
    hatchery_id = Column(String(36), ForeignKey("hatcheries.id"), nullable=False)
    invoice_number = Column(String(100), nullable=False)
    batch_number = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)
    chick_cost = Column(Float, nullable=False)
    transport_cost = Column(Float, default=0.0)
    vaccination_cost = Column(Float, default=0.0)
    other_cost = Column(Float, default=0.0)
    total_cost = Column(Float, nullable=False)

class ChickTransfer(Base):
    __tablename__ = "chick_transfers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    transfer_date = Column(DateTime, default=datetime.utcnow)
    chick_purchase_id = Column(String(36), ForeignKey("chick_purchases.id"), nullable=False)
    destination_farm_id = Column(String(36), ForeignKey("farms.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    vehicle_number = Column(String(50), nullable=True)
    driver_name = Column(String(100), nullable=True)
    transport_cost = Column(Float, default=0.0)

class Flock(Base):
    __tablename__ = "flocks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    flock_code = Column(String(50), unique=True, nullable=False, index=True)
    batch_number = Column(String(100), nullable=False, index=True)
    farm_id = Column(String(36), ForeignKey("farms.id"), nullable=False)
    shed_id = Column(String(36), ForeignKey("sheds.id"), nullable=True)
    hatchery_id = Column(String(36), ForeignKey("hatcheries.id"), nullable=True)
    supervisor_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    placement_date = Column(DateTime, nullable=False)
    breed = Column(String(100), default="Cobb 500")
    placed_quantity = Column(Integer, nullable=False)
    chick_cost_per_unit = Column(Float, nullable=False)
    
    # Live aggregated balances
    current_birds = Column(Integer, nullable=False)
    total_mortality = Column(Integer, default=0)
    total_culling = Column(Integer, default=0)
    total_lifted = Column(Integer, default=0)
    total_feed_consumed_kg = Column(Float, default=0.0)
    avg_body_weight_kg = Column(Float, default=0.0)
    current_fcr = Column(Float, default=0.0)

    status = Column(String(30), default="ACTIVE") # PLANNED, PLACED, ACTIVE, READY_FOR_LIFTING, PARTIALLY_LIFTED, CLOSED
    closed_at = Column(DateTime, nullable=True)

    daily_reports = relationship("DailyReport", back_populates="flock", cascade="all, delete-orphan")
