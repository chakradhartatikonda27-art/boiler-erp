from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserAssignmentOut(BaseModel):
    id: str
    state_id: Optional[str] = None
    branch_id: Optional[str] = None
    area_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str # ADMIN, MANAGER, SUPERVISOR, ACCOUNTANT
    mobile: Optional[str] = None

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool
    mobile: Optional[str] = None
    created_at: datetime
    assignments: List[UserAssignmentOut] = []

    model_config = ConfigDict(from_attributes=True)

Token.model_rebuild()
