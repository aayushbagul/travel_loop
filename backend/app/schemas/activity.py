from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActivityBase(BaseModel):
    name: str
    type: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    duration_minutes: Optional[int] = None
    price_estimate: Optional[float] = None

class ActivityResponse(ActivityBase):
    id: int
    city_id: int
    created_at: datetime

    class Config:
        from_attributes = True
