from fastapi import APIRouter
from typing import List
from app.schemas.city import CityResponse
from app.schemas.activity import ActivityResponse
from app.services import city_service
from app.services import activity_service

router = APIRouter(prefix="/cities", tags=["Cities"])

@router.get("", response_model=List[CityResponse])
async def get_cities():
    return await city_service.get_cities()

@router.get("/{city_id}", response_model=CityResponse)
async def get_city(city_id: int):
    return await city_service.get_city(city_id)

@router.get("/{city_id}/activities", response_model=List[ActivityResponse])
async def get_city_activities(city_id: int):
    # Verify city exists first
    await city_service.get_city(city_id)
    return await activity_service.get_activities_by_city(city_id)
