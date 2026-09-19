import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    address = Column(String(500), nullable=True)
    gst_number = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class State(Base):
    __tablename__ = "states"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(10), nullable=False)

    branches = relationship("Branch", back_populates="state", cascade="all, delete-orphan")

class Branch(Base):
    __tablename__ = "branches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    state_id = Column(String(36), ForeignKey("states.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(20), nullable=False)

    state = relationship("State", back_populates="branches")
    areas = relationship("Area", back_populates="branch", cascade="all, delete-orphan")

class Area(Base):
    __tablename__ = "areas"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    branch_id = Column(String(36), ForeignKey("branches.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(20), nullable=False)

    branch = relationship("Branch", back_populates="areas")
