from pydantic import BaseModel
from typing import Optional
from datetime import date, time
from app.schemas.activity import ActivityResponse

class TripActivityBase(BaseModel):
    activity_id: int
    date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    notes: Optional[str] = None

class TripActivityCreate(TripActivityBase):
    pass

class TripActivityResponse(TripActivityBase):
    id: int
    stop_id: int
    activity: Optional[ActivityResponse] = None

    class Config:
        from_attributes = True
