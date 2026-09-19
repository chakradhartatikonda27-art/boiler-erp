import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class DailyReport(Base):
    __tablename__ = "daily_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    flock_id = Column(String(36), ForeignKey("flocks.id"), nullable=False, index=True)
    report_date = Column(DateTime, nullable=False, index=True)
    day_age = Column(Integer, nullable=False)
    opening_birds = Column(Integer, nullable=False)
    mortality_count = Column(Integer, default=0)
    culling_count = Column(Integer, default=0)
    birds_lifted_count = Column(Integer, default=0)
    closing_birds = Column(Integer, nullable=False)
    
    feed_consumed_bags = Column(Float, default=0.0)
    feed_consumed_kg = Column(Float, default=0.0)
    feed_type = Column(String(100), nullable=True) # Starter, Grower, Finisher
    water_consumption_liters = Column(Float, default=0.0)
    avg_body_weight_g = Column(Float, default=0.0)
    fcr = Column(Float, default=0.0)
    
    medicines_used = Column(String(500), nullable=True)
    vaccination_done = Column(String(255), nullable=True)
    remarks = Column(String(500), nullable=True)
    submitted_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    flock = relationship("Flock", back_populates="daily_reports")

class MortalityEntry(Base):
    __tablename__ = "mortality_entries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    flock_id = Column(String(36), ForeignKey("flocks.id"), nullable=False)
    entry_date = Column(DateTime, default=datetime.utcnow)
    count = Column(Integer, nullable=False)
    reason_category = Column(String(100), nullable=False) # Disease, Weakness, Heat Stress, Accident, Unknown, Other
    notes = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)

class CullingEntry(Base):
    __tablename__ = "culling_entries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    flock_id = Column(String(36), ForeignKey("flocks.id"), nullable=False)
    entry_date = Column(DateTime, default=datetime.utcnow)
    count = Column(Integer, nullable=False)
    reason = Column(String(255), nullable=False)
    remarks = Column(String(500), nullable=True)
