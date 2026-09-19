import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from app.database import Base

class FeedType(Base):
    __tablename__ = "feed_types"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False) # Pre-Starter, Starter, Grower, Finisher
    bag_weight_kg = Column(Float, default=50.0)
    cost_per_kg = Column(Float, nullable=False)

class FeedLocation(Base):
    __tablename__ = "feed_locations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    location_type = Column(String(50), nullable=False) # GODOWN, FARM, MILL, OFFICE
    farm_id = Column(String(36), ForeignKey("farms.id"), nullable=True)

class FeedTransaction(Base):
    __tablename__ = "feed_transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    transaction_date = Column(DateTime, default=datetime.utcnow, index=True)
    transaction_type = Column(String(50), nullable=False) # OPENING, PURCHASE, TRANSFER_IN, TRANSFER_OUT, CONSUMPTION, ADJUSTMENT, WASTAGE
    feed_type_id = Column(String(36), ForeignKey("feed_types.id"), nullable=False)
    location_id = Column(String(36), ForeignKey("feed_locations.id"), nullable=False)
    flock_id = Column(String(36), ForeignKey("flocks.id"), nullable=True)
    
    quantity_bags = Column(Float, nullable=False)
    quantity_kg = Column(Float, nullable=False)
    unit_cost = Column(Float, default=0.0)
    total_cost = Column(Float, default=0.0)
    
    source_location_id = Column(String(36), ForeignKey("feed_locations.id"), nullable=True)
    destination_location_id = Column(String(36), ForeignKey("feed_locations.id"), nullable=True)
    reference_number = Column(String(100), nullable=True)
    remarks = Column(String(500), nullable=True)

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False) # Vaccine, Antibiotic, Vitamin, Sanitizer
    unit = Column(String(20), nullable=False) # ml, bottle, kg, dose
    min_stock_alert = Column(Float, default=10.0)

class MedicineBatch(Base):
    __tablename__ = "medicine_batches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    medicine_id = Column(String(36), ForeignKey("medicines.id"), nullable=False)
    batch_number = Column(String(100), nullable=False)
    expiry_date = Column(DateTime, nullable=False)
    quantity_available = Column(Float, nullable=False)
    unit_cost = Column(Float, nullable=False)
    supplier_name = Column(String(255), nullable=True)

class MedicineTransaction(Base):
    __tablename__ = "medicine_transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    transaction_date = Column(DateTime, default=datetime.utcnow)
    transaction_type = Column(String(50), nullable=False) # PURCHASE, CONSUMPTION, EXPIRED, TRANSFER
    medicine_batch_id = Column(String(36), ForeignKey("medicine_batches.id"), nullable=False)
    flock_id = Column(String(36), ForeignKey("flocks.id"), nullable=True)
    quantity = Column(Float, nullable=False)
    total_cost = Column(Float, default=0.0)
    remarks = Column(String(500), nullable=True)
