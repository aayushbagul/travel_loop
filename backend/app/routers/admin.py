from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from app.schemas.admin import GlobalStats, TopCity, TopActivity
from app.schemas.user import UserResponse
from app.schemas.trip import TripResponse
from app.services import admin_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin"])

# Simplified admin check
async def get_admin_user(current_user: User = Depends(get_current_user)):
    # In a real app, you'd check a role or flag. For this hackathon:
    # if current_user.email != "admin@admin.com":
    #     raise HTTPException(status_code=403, detail="Admin only")
    return current_user

@router.get("/stats", response_model=GlobalStats)
async def get_stats(admin: User = Depends(get_admin_user)):
    return await admin_service.get_global_stats()

@router.get("/users", response_model=List[UserResponse])
async def get_users(admin: User = Depends(get_admin_user)):
    return await admin_service.get_all_users()

@router.get("/users/{id}", response_model=UserResponse)
async def get_user(id: int, admin: User = Depends(get_admin_user)):
    return await admin_service.get_user(id)

@router.delete("/users/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(id: int, admin: User = Depends(get_admin_user)):
    await admin_service.delete_user(id)

@router.put("/users/{id}/suspend", response_model=UserResponse)
async def suspend_user(id: int, admin: User = Depends(get_admin_user)):
    return await admin_service.suspend_user(id)

@router.get("/cities/top", response_model=List[TopCity])
async def get_top_cities(admin: User = Depends(get_admin_user)):
    return await admin_service.get_top_cities()

@router.get("/activities/top", response_model=List[TopActivity])
async def get_top_activities(admin: User = Depends(get_admin_user)):
    return await admin_service.get_top_activities()

@router.get("/trips/recent", response_model=List[TripResponse])
async def get_recent_trips(admin: User = Depends(get_admin_user)):
    return await admin_service.get_recent_trips()
