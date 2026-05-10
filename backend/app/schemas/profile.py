from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.city import CityResponse
from datetime import datetime

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class SavedDestinationResponse(BaseModel):
    id: int
    user_id: int
    city_id: int
    created_at: datetime
    city: Optional[CityResponse] = None

    class Config:
        from_attributes = True

class SavedDestinationCreate(BaseModel):
    city_id: int
