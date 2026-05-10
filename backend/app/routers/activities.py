from fastapi import APIRouter
from typing import List
from app.schemas.activity import ActivityResponse
from app.services import activity_service

router = APIRouter(prefix="/activities", tags=["Activities"])

@router.get("", response_model=List[ActivityResponse])
async def get_activities():
    return await activity_service.get_activities()

@router.get("/{activity_id}", response_model=ActivityResponse)
async def get_activity(activity_id: int):
    return await activity_service.get_activity(activity_id)
