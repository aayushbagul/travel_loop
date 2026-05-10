from fastapi import HTTPException
from app.models.user import User
from app.models.city import City
from app.models.saved_destination import SavedDestination
from app.schemas.profile import ProfileUpdate, PasswordUpdate
from app.utils.security import verify_password, get_password_hash

async def update_profile(user_id: int, profile_data: ProfileUpdate):
    user = await User.get(id=user_id)
    update_data = profile_data.model_dump(exclude_unset=True)
    if update_data:
        # Check if email is being updated to an existing one
        if "email" in update_data and update_data["email"] != user.email:
            existing = await User.filter(email=update_data["email"]).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email already taken")
        
        await user.update_from_dict(update_data).save()
    return user

async def update_password(user_id: int, passwords: PasswordUpdate):
    user = await User.get(id=user_id)
    if not verify_password(passwords.current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    user.hashed_password = get_password_hash(passwords.new_password)
    await user.save()
    return {"message": "Password updated successfully"}

async def delete_account(user_id: int):
    user = await User.get(id=user_id)
    await user.delete()

async def get_saved_destinations(user_id: int):
    return await SavedDestination.filter(user_id=user_id).prefetch_related('city').all()

async def add_saved_destination(user_id: int, city_id: int):
    city = await City.get_or_none(id=city_id)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
        
    existing = await SavedDestination.filter(user_id=user_id, city_id=city_id).first()
    if existing:
        return existing
        
    return await SavedDestination.create(user_id=user_id, city_id=city_id)

async def remove_saved_destination(user_id: int, city_id: int):
    saved = await SavedDestination.filter(user_id=user_id, city_id=city_id).first()
    if not saved:
        raise HTTPException(status_code=404, detail="Saved destination not found")
    await saved.delete()
