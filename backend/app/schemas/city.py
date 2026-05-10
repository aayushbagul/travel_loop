from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CityBase(BaseModel):
    name: str
    country: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class CityResponse(CityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
