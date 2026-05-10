from fastapi import APIRouter, Depends, status, UploadFile, File
from typing import List
from app.schemas.user import UserResponse
from app.schemas.profile import ProfileUpdate, PasswordUpdate, SavedDestinationCreate, SavedDestinationResponse
from app.services import profile_service
from app.dependencies.auth import get_current_user
from app.models.user import User
import shutil
import os

router = APIRouter(prefix="/users/me", tags=["Profile"])

@router.put("", response_model=UserResponse)
async def update_profile(profile_data: ProfileUpdate, current_user: User = Depends(get_current_user)):
    return await profile_service.update_profile(current_user.id, profile_data)

@router.post("/photo", response_model=UserResponse)
async def upload_photo(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    # Basic local file saving for hackathon
    os.makedirs("uploads/profiles", exist_ok=True)
    file_location = f"uploads/profiles/{current_user.id}_{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    # Update user
    current_user.profile_photo = file_location
    await current_user.save()
    return current_user

@router.put("/password")
async def update_password(passwords: PasswordUpdate, current_user: User = Depends(get_current_user)):
    return await profile_service.update_password(current_user.id, passwords)

@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(current_user: User = Depends(get_current_user)):
    await profile_service.delete_account(current_user.id)

# Saved Destinations
@router.get("/saved-destinations", response_model=List[SavedDestinationResponse])
async def get_saved_destinations(current_user: User = Depends(get_current_user)):
    return await profile_service.get_saved_destinations(current_user.id)

@router.post("/saved-destinations", response_model=SavedDestinationResponse, status_code=status.HTTP_201_CREATED)
async def add_saved_destination(destination_data: SavedDestinationCreate, current_user: User = Depends(get_current_user)):
    return await profile_service.add_saved_destination(current_user.id, destination_data.city_id)

@router.delete("/saved-destinations/{city_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_saved_destination(city_id: int, current_user: User = Depends(get_current_user)):
    await profile_service.remove_saved_destination(current_user.id, city_id)
