from fastapi import APIRouter, Depends, status
from typing import List
from app.schemas.stop import StopCreate, StopUpdate, StopResponse, StopReorder
from app.services import stop_service
from app.dependencies.auth import get_current_user
from app.models.user import User

# This router should be included under the /trips prefix, so the path looks like /trips/{trip_id}/stops
router = APIRouter(prefix="/trips", tags=["Stops"])

@router.get("/{trip_id}/stops", response_model=List[StopResponse])
async def get_stops(trip_id: int, current_user: User = Depends(get_current_user)):
    return await stop_service.get_trip_stops(trip_id, current_user.id)

@router.post("/{trip_id}/stops", response_model=StopResponse, status_code=status.HTTP_201_CREATED)
async def create_stop(trip_id: int, stop_data: StopCreate, current_user: User = Depends(get_current_user)):
    return await stop_service.create_stop(trip_id, current_user.id, stop_data)

@router.put("/{trip_id}/stops/reorder")
async def reorder_stops(trip_id: int, reorder_data: StopReorder, current_user: User = Depends(get_current_user)):
    await stop_service.reorder_stops(trip_id, current_user.id, reorder_data.stop_ids)
    return {"message": "Stops reordered successfully"}

@router.put("/{trip_id}/stops/{stop_id}", response_model=StopResponse)
async def update_stop(trip_id: int, stop_id: int, stop_data: StopUpdate, current_user: User = Depends(get_current_user)):
    return await stop_service.update_stop(trip_id, stop_id, current_user.id, stop_data)

@router.delete("/{trip_id}/stops/{stop_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_stop(trip_id: int, stop_id: int, current_user: User = Depends(get_current_user)):
    await stop_service.delete_stop(trip_id, stop_id, current_user.id)
