import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farmer_code = Column(String(50), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    mobile = Column(String(20), nullable=False)
    address = Column(String(500), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    mandal = Column(String(100), nullable=True)
    village = Column(String(100), nullable=True)
    branch_id = Column(String(36), ForeignKey("branches.id"), nullable=True)
    bank_name = Column(String(150), nullable=True)
    bank_account_no = Column(String(50), nullable=True)
    ifsc_code = Column(String(20), nullable=True)
    status = Column(String(20), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

    farms = relationship("Farm", back_populates="farmer", cascade="all, delete-orphan", lazy="selectin")
    documents = relationship("FarmerDocument", back_populates="farmer", cascade="all, delete-orphan", lazy="selectin")

class Farm(Base):
    __tablename__ = "farms"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farm_code = Column(String(50), unique=True, nullable=False, index=True)
    farm_name = Column(String(255), nullable=False)
    farmer_id = Column(String(36), ForeignKey("farmers.id"), nullable=False)
    area_id = Column(String(36), ForeignKey("areas.id"), nullable=True)
    supervisor_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    total_capacity = Column(Integer, default=0)
    gps_latitude = Column(Float, nullable=True)
    gps_longitude = Column(Float, nullable=True)
    status = Column(String(20), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("Farmer", back_populates="farms")
    sheds = relationship("Shed", back_populates="farm", cascade="all, delete-orphan", lazy="selectin")

class Shed(Base):
    __tablename__ = "sheds"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farm_id = Column(String(36), ForeignKey("farms.id"), nullable=False)
    shed_number = Column(String(50), nullable=False)
    capacity = Column(Integer, nullable=False)
    area_sqft = Column(Float, nullable=True)
    status = Column(String(20), default="ACTIVE")

    farm = relationship("Farm", back_populates="sheds")

class FarmerDocument(Base):
    __tablename__ = "farmer_documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farmer_id = Column(String(36), ForeignKey("farmers.id"), nullable=False)
    document_type = Column(String(50), nullable=False) # Aadhaar, PAN, BankPassbook, Agreement
    file_path = Column(String(500), nullable=False)
    uploaded_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="VERIFIED")
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("Farmer", back_populates="documents")
