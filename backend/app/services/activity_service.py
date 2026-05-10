from fastapi import HTTPException
from app.models.activity import Activity
from typing import List

async def get_activities() -> List[Activity]:
    return await Activity.all()

async def get_activity(activity_id: int) -> Activity:
    activity = await Activity.get_or_none(id=activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity

async def get_activities_by_city(city_id: int) -> List[Activity]:
    return await Activity.filter(city_id=city_id).all()
