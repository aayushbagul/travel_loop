from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from app.schemas.city import CityResponse

class StopBase(BaseModel):
    city_id: int
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None

class StopCreate(StopBase):
    pass

class StopUpdate(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None

class StopResponse(StopBase):
    id: int
    trip_id: int
    order: int
    created_at: datetime
    city: Optional[CityResponse] = None

    class Config:
        from_attributes = True

class StopReorder(BaseModel):
    stop_ids: List[int] # Ordered list of stop IDs
