from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    profile_photo: Optional[str] = None
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True
