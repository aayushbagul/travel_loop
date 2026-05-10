from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class TripBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    cover_photo: Optional[str] = None

class TripCreate(TripBase):
    pass

class TripUpdate(TripBase):
    title: Optional[str] = None

class TripResponse(TripBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TripShareResponse(BaseModel):
    share_token: str
    role: str
