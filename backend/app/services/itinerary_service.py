from fastapi import HTTPException
from app.models.trip import Trip
from app.models.stop import Stop
from app.models.trip_activity import TripActivity
from app.models.activity import Activity
from app.schemas.trip_activity import TripActivityCreate
from app.schemas.itinerary import ItineraryResponse, ItineraryStop
from app.services.trip_service import get_trip

async def add_stop_activity(stop_id: int, user_id: int, activity_data: TripActivityCreate):
    # Verify stop and trip access
    stop = await Stop.get_or_none(id=stop_id).prefetch_related('trip')
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
        
    await get_trip(stop.trip.id, user_id)
    
    activity = await Activity.get_or_none(id=activity_data.activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    trip_act = await TripActivity.create(stop_id=stop_id, **activity_data.model_dump())
    await trip_act.fetch_related('activity')
    return trip_act

async def remove_stop_activity(stop_id: int, trip_activity_id: int, user_id: int):
    stop = await Stop.get_or_none(id=stop_id).prefetch_related('trip')
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
        
    await get_trip(stop.trip.id, user_id)
    
    trip_act = await TripActivity.get_or_none(id=trip_activity_id, stop_id=stop_id)
    if not trip_act:
        raise HTTPException(status_code=404, detail="Trip activity not found")
        
    await trip_act.delete()

async def get_itinerary(trip_id: int, user_id: int) -> ItineraryResponse:
    trip = await get_trip(trip_id, user_id)
    
    stops = await Stop.filter(trip_id=trip_id).order_by('order').prefetch_related('city').all()
    itinerary_stops = []
    
    for stop in stops:
        trip_activities = await TripActivity.filter(stop_id=stop.id).prefetch_related('activity').all()
        # Convert model to schema
        stop_data = ItineraryStop.model_validate(stop)
        stop_data.trip_activities = trip_activities
        itinerary_stops.append(stop_data)
        
    return ItineraryResponse(trip=trip, stops=itinerary_stops)
