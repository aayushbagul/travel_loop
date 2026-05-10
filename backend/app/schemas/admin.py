from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.user import UserResponse
from app.schemas.trip import TripResponse

class GlobalStats(BaseModel):
    total_users: int
    active_trips: int
    total_destinations_saved: int
    total_activities_booked: int

class TopCity(BaseModel):
    city_id: int
    city_name: str
    saves_count: int

class TopActivity(BaseModel):
    activity_id: int
    activity_name: str
    booking_count: int
