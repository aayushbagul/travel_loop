from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PostBase(BaseModel):
    content: str
    trip_id: Optional[int] = None

class PostCreate(PostBase):
    pass

class PostUser(BaseModel):
    id: int
    name: Optional[str] = None
    email: str

    class Config:
        from_attributes = True

class PostTrip(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True

class PostResponse(PostBase):
    id: int
    likes_count: int
    comments_count: int
    created_at: datetime
    user: PostUser
    trip: Optional[PostTrip] = None

    class Config:
        from_attributes = True
