import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="SUPERVISOR") # ADMIN, MANAGER, SUPERVISOR, ACCOUNTANT
    is_active = Column(Boolean, default=True)
    mobile = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    assignments = relationship("UserAssignment", back_populates="user", cascade="all, delete-orphan", lazy="selectin")

class UserAssignment(Base):
    __tablename__ = "user_assignments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    state_id = Column(String(36), ForeignKey("states.id"), nullable=True)
    branch_id = Column(String(36), ForeignKey("branches.id"), nullable=True)
    area_id = Column(String(36), ForeignKey("areas.id"), nullable=True)

    user = relationship("User", back_populates="assignments")
