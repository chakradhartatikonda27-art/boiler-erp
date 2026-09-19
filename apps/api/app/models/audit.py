import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    user_email = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False, index=True) # FARM_CREATED, FLOCK_PLACED, MORTALITY_UPDATED, EXPENSE_APPROVED, etc.
    module = Column(String(50), nullable=False, index=True) # FARM, FLOCK, INVENTORY, FINANCE, SALES
    record_id = Column(String(100), nullable=True)
    old_value_json = Column(Text, nullable=True)
    new_value_json = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    key = Column(String(100), unique=True, nullable=False)
    value = Column(String(500), nullable=False)
    description = Column(String(255), nullable=True)
    category = Column(String(50), default="BUSINESS") # BUSINESS, NOTIFICATION, GENERAL

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(String(500), nullable=False)
    notification_type = Column(String(50), nullable=False) # HIGH_MORTALITY, LOW_FEED, EXPENSE_PENDING, LIFTING_READY
    is_read = Column(String(10), default="UNREAD")
    created_at = Column(DateTime, default=datetime.utcnow)
