from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PackingItemBase(BaseModel):
    name: str
    quantity: Optional[int] = 1
    is_packed: Optional[bool] = False
    category: Optional[str] = None

class PackingItemCreate(PackingItemBase):
    pass

class PackingItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    is_packed: Optional[bool] = None
    category: Optional[str] = None

class PackingItemResponse(PackingItemBase):
    id: int
    trip_id: int
    created_at: datetime

    class Config:
        from_attributes = True
