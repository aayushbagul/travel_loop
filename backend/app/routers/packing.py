from fastapi import APIRouter, Depends, status
from typing import List
from app.schemas.packing import PackingItemCreate, PackingItemUpdate, PackingItemResponse
from app.services import packing_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/trips", tags=["Packing"])

@router.get("/{trip_id}/packing", response_model=List[PackingItemResponse])
async def get_packing_items(trip_id: int, current_user: User = Depends(get_current_user)):
    return await packing_service.get_packing_items(trip_id, current_user.id)

@router.post("/{trip_id}/packing", response_model=PackingItemResponse, status_code=status.HTTP_201_CREATED)
async def create_packing_item(trip_id: int, item_data: PackingItemCreate, current_user: User = Depends(get_current_user)):
    return await packing_service.create_packing_item(trip_id, current_user.id, item_data)

@router.put("/{trip_id}/packing/{item_id}", response_model=PackingItemResponse)
async def update_packing_item(trip_id: int, item_id: int, item_data: PackingItemUpdate, current_user: User = Depends(get_current_user)):
    return await packing_service.update_packing_item(trip_id, item_id, current_user.id, item_data)

@router.delete("/{trip_id}/packing/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_packing_item(trip_id: int, item_id: int, current_user: User = Depends(get_current_user)):
    await packing_service.delete_packing_item(trip_id, item_id, current_user.id)

@router.delete("/{trip_id}/packing/reset", status_code=status.HTTP_204_NO_CONTENT)
async def reset_packing_items(trip_id: int, current_user: User = Depends(get_current_user)):
    await packing_service.reset_packing_items(trip_id, current_user.id)
