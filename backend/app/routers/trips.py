from fastapi import APIRouter, Depends, status
from typing import List
from app.schemas.trip import TripCreate, TripUpdate, TripResponse, TripShareResponse
from app.schemas.stop import StopResponse
from app.services import trip_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.get("", response_model=List[TripResponse])
async def get_trips(current_user: User = Depends(get_current_user)):
    return await trip_service.get_user_trips(current_user.id)

@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(trip_data: TripCreate, current_user: User = Depends(get_current_user)):
    return await trip_service.create_trip(current_user.id, trip_data)

@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(trip_id: int, current_user: User = Depends(get_current_user)):
    return await trip_service.get_trip(trip_id, current_user.id)

@router.put("/{trip_id}", response_model=TripResponse)
async def update_trip(trip_id: int, trip_data: TripUpdate, current_user: User = Depends(get_current_user)):
    return await trip_service.update_trip(trip_id, current_user.id, trip_data)

@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(trip_id: int, current_user: User = Depends(get_current_user)):
    await trip_service.delete_trip(trip_id, current_user.id)

# Sharing
@router.post("/{trip_id}/share", response_model=TripShareResponse)
async def share_trip(trip_id: int, role: str = "viewer", current_user: User = Depends(get_current_user)):
    return await trip_service.share_trip(trip_id, current_user.id, role)

@router.delete("/{trip_id}/share", status_code=status.HTTP_204_NO_CONTENT)
async def unshare_trip(trip_id: int, current_user: User = Depends(get_current_user)):
    await trip_service.unshare_trip(trip_id, current_user.id)

@router.get("/shared/{token}", response_model=TripResponse)
async def get_shared_trip(token: str):
    return await trip_service.get_shared_trip(token)

@router.post("/shared/{token}/copy", response_model=TripResponse)
async def copy_shared_trip(token: str, current_user: User = Depends(get_current_user)):
    # Basic implementation: Just duplicate the trip for the current user
    # A real implementation would also deep-copy stops, activities, etc.
    original_trip = await trip_service.get_shared_trip(token)
    trip_data = TripCreate(
        title=f"Copy of {original_trip.title}",
        description=original_trip.description,
        start_date=original_trip.start_date,
        end_date=original_trip.end_date,
        cover_photo=original_trip.cover_photo
    )
    return await trip_service.create_trip(current_user.id, trip_data)
