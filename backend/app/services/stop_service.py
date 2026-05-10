from fastapi import HTTPException
from app.models.stop import Stop
from app.models.city import City
from app.schemas.stop import StopCreate, StopUpdate
from app.services.trip_service import get_trip

async def get_trip_stops(trip_id: int, user_id: int):
    # Verify access via get_trip
    await get_trip(trip_id, user_id)
    
    return await Stop.filter(trip_id=trip_id).prefetch_related('city').all()

async def create_stop(trip_id: int, user_id: int, stop_data: StopCreate):
    # Verify access (should really check for editor role, simplifying for now)
    await get_trip(trip_id, user_id)
    
    city = await City.get_or_none(id=stop_data.city_id)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
        
    # Get current max order
    current_stops = await Stop.filter(trip_id=trip_id).all()
    next_order = len(current_stops) + 1
    
    stop = await Stop.create(
        trip_id=trip_id, 
        order=next_order,
        **stop_data.model_dump()
    )
    await stop.fetch_related('city')
    return stop

async def update_stop(trip_id: int, stop_id: int, user_id: int, stop_data: StopUpdate):
    await get_trip(trip_id, user_id)
    
    stop = await Stop.get_or_none(id=stop_id, trip_id=trip_id)
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
        
    update_data = stop_data.model_dump(exclude_unset=True)
    if update_data:
        await stop.update_from_dict(update_data).save()
        
    await stop.fetch_related('city')
    return stop

async def delete_stop(trip_id: int, stop_id: int, user_id: int):
    await get_trip(trip_id, user_id)
    
    stop = await Stop.get_or_none(id=stop_id, trip_id=trip_id)
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
        
    await stop.delete()
    
    # Reorder remaining stops
    stops = await Stop.filter(trip_id=trip_id).order_by('order').all()
    for index, s in enumerate(stops):
        s.order = index + 1
        await s.save()

async def reorder_stops(trip_id: int, user_id: int, stop_ids: list[int]):
    await get_trip(trip_id, user_id)
    
    stops = await Stop.filter(trip_id=trip_id).all()
    stop_map = {s.id: s for s in stops}
    
    if len(stop_ids) != len(stops):
        raise HTTPException(status_code=400, detail="Must provide all stop IDs for reordering")
        
    for index, stop_id in enumerate(stop_ids):
        if stop_id not in stop_map:
            raise HTTPException(status_code=400, detail=f"Invalid stop ID {stop_id}")
        stop = stop_map[stop_id]
        stop.order = index + 1
        await stop.save()
