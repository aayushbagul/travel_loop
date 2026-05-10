from fastapi import APIRouter, Depends, status
from app.schemas.itinerary import ItineraryResponse
from app.schemas.trip_activity import TripActivityCreate, TripActivityResponse
from app.services import itinerary_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(tags=["Itinerary"])

@router.get("/trips/{trip_id}/itinerary", response_model=ItineraryResponse)
async def get_itinerary(trip_id: int, current_user: User = Depends(get_current_user)):
    return await itinerary_service.get_itinerary(trip_id, current_user.id)

@router.post("/stops/{stop_id}/activities", response_model=TripActivityResponse, status_code=status.HTTP_201_CREATED)
async def add_stop_activity(stop_id: int, activity_data: TripActivityCreate, current_user: User = Depends(get_current_user)):
    return await itinerary_service.add_stop_activity(stop_id, current_user.id, activity_data)

@router.delete("/stops/{stop_id}/activities/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_stop_activity(stop_id: int, id: int, current_user: User = Depends(get_current_user)):
    await itinerary_service.remove_stop_activity(stop_id, id, current_user.id)
