from fastapi import HTTPException
from app.models.trip import Trip
from app.models.stop import Stop
from app.models.trip_activity import TripActivity
from app.models.activity import Activity
from app.models.budget import BudgetItem
from app.models.user import User
from app.schemas.trip_activity import TripActivityCreate
from app.schemas.itinerary import ItineraryResponse, ItineraryStop
from app.services.trip_service import get_trip

async def add_stop_activity(stop_id: int, user: User, activity_data: TripActivityCreate):
    # Verify stop and trip access
    stop = await Stop.get_or_none(id=stop_id).prefetch_related('trip')
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
        
    await get_trip(stop.trip.id, user)
    
    activity = await Activity.get_or_none(id=activity_data.activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    trip_act = await TripActivity.create(stop_id=stop_id, **activity_data.model_dump())
    await trip_act.fetch_related('activity')
    
    if activity.price_estimate and activity.price_estimate > 0:
        await BudgetItem.create(
            trip_id=stop.trip.id,
            category=activity.type or "Activity",
            description=f"Auto-generated: {activity.name}",
            amount=activity.price_estimate,
            is_paid=False
        )
        
    return trip_act

async def remove_stop_activity(stop_id: int, trip_activity_id: int, user: User):
    stop = await Stop.get_or_none(id=stop_id).prefetch_related('trip')
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
        
    await get_trip(stop.trip.id, user)
    
    trip_act = await TripActivity.get_or_none(id=trip_activity_id, stop_id=stop_id).prefetch_related('activity')
    if not trip_act:
        raise HTTPException(status_code=404, detail="Trip activity not found")
        
    if trip_act.activity and trip_act.activity.price_estimate:
        budget_item = await BudgetItem.filter(
            trip_id=stop.trip.id,
            description=f"Auto-generated: {trip_act.activity.name}",
            amount=trip_act.activity.price_estimate
        ).first()
        if budget_item:
            await budget_item.delete()
            
    await trip_act.delete()

async def get_itinerary(trip_id: int, user: User) -> ItineraryResponse:
    trip = await get_trip(trip_id, user)
    
    stops = await Stop.filter(trip_id=trip_id).order_by('order').prefetch_related('city').all()
    itinerary_stops = []
    
    for stop in stops:
        trip_activities = await TripActivity.filter(stop_id=stop.id).prefetch_related('activity').all()
        # Convert model to schema
        stop_data = ItineraryStop.model_validate(stop)
        stop_data.trip_activities = trip_activities
        itinerary_stops.append(stop_data)
        
    return ItineraryResponse(trip=trip, stops=itinerary_stops)
