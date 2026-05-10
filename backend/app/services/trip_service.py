from fastapi import HTTPException
from app.models.trip import Trip
from app.models.collaborator import Collaborator
from app.schemas.trip import TripCreate, TripUpdate
import uuid

async def create_trip(user_id: int, trip_data: TripCreate) -> Trip:
    trip = await Trip.create(user_id=user_id, **trip_data.model_dump())
    return trip

async def get_user_trips(user_id: int):
    # Includes trips owned by user and trips shared with user
    owned_trips = await Trip.filter(user_id=user_id).all()
    
    shared_collabs = await Collaborator.filter(user_id=user_id).prefetch_related('trip').all()
    shared_trips = [collab.trip for collab in shared_collabs]
    
    # Merge and remove duplicates if any
    all_trips = list({t.id: t for t in (owned_trips + shared_trips)}.values())
    return all_trips

async def get_trip(trip_id: int, user_id: int) -> Trip:
    trip = await Trip.get_or_none(id=trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    # Check access
    if trip.user_id != user_id:
        collab = await Collaborator.filter(trip_id=trip.id, user_id=user_id).first()
        if not collab:
            raise HTTPException(status_code=403, detail="Not authorized to view this trip")
            
    return trip

async def update_trip(trip_id: int, user_id: int, trip_data: TripUpdate) -> Trip:
    trip = await get_trip(trip_id, user_id) # Reuse access check
    
    # Check if user is owner or editor
    if trip.user_id != user_id:
        collab = await Collaborator.filter(trip_id=trip.id, user_id=user_id).first()
        if collab.role != "editor":
            raise HTTPException(status_code=403, detail="Not authorized to edit this trip")

    update_data = trip_data.model_dump(exclude_unset=True)
    if update_data:
        await trip.update_from_dict(update_data).save()
    return trip

async def delete_trip(trip_id: int, user_id: int):
    trip = await Trip.get_or_none(id=trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    if trip.user_id != user_id:
        raise HTTPException(status_code=403, detail="Only the owner can delete a trip")
        
    await trip.delete()

# Sharing Logic
async def share_trip(trip_id: int, user_id: int, role: str = "viewer"):
    trip = await Trip.get_or_none(id=trip_id)
    if not trip or trip.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to share this trip")
        
    token = str(uuid.uuid4())
    collab = await Collaborator.create(trip_id=trip_id, role=role, share_token=token)
    return {"share_token": token, "role": role}

async def unshare_trip(trip_id: int, user_id: int):
    trip = await Trip.get_or_none(id=trip_id)
    if not trip or trip.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to modify sharing")
        
    await Collaborator.filter(trip_id=trip_id).delete()

async def get_shared_trip(token: str):
    collab = await Collaborator.get_or_none(share_token=token).prefetch_related('trip')
    if not collab:
        raise HTTPException(status_code=404, detail="Invalid share token")
    return collab.trip
