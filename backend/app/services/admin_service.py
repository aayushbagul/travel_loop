from fastapi import HTTPException
from app.models.user import User
from app.models.trip import Trip
from app.models.city import City
from app.models.activity import Activity
from app.models.saved_destination import SavedDestination
from app.models.trip_activity import TripActivity
from app.schemas.admin import GlobalStats, TopCity, TopActivity
from typing import List

async def get_global_stats() -> GlobalStats:
    users = await User.all().count()
    trips = await Trip.all().count()
    saves = await SavedDestination.all().count()
    activities = await TripActivity.all().count()
    
    return GlobalStats(
        total_users=users,
        active_trips=trips,
        total_destinations_saved=saves,
        total_activities_booked=activities
    )

async def get_all_users() -> List[User]:
    return await User.all()

async def get_user(user_id: int) -> User:
    user = await User.get_or_none(id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def suspend_user(user_id: int) -> User:
    user = await get_user(user_id)
    user.is_suspended = not user.is_suspended
    await user.save()
    return user

async def delete_user(user_id: int):
    user = await get_user(user_id)
    await user.delete()

async def get_recent_trips(limit: int = 10) -> List[Trip]:
    return await Trip.all().order_by('-created_at').limit(limit)

async def get_top_cities(limit: int = 5) -> List[TopCity]:
    # Simplified logic: just getting most saved destinations
    cities = await City.all()
    results = []
    for city in cities:
        saves = await SavedDestination.filter(city_id=city.id).count()
        results.append(TopCity(city_id=city.id, city_name=city.name, saves_count=saves))
        
    results.sort(key=lambda x: x.saves_count, reverse=True)
    return results[:limit]

async def get_top_activities(limit: int = 5) -> List[TopActivity]:
    # Simplified logic
    activities = await Activity.all()
    results = []
    for act in activities:
        bookings = await TripActivity.filter(activity_id=act.id).count()
        results.append(TopActivity(activity_id=act.id, activity_name=act.name, booking_count=bookings))
        
    results.sort(key=lambda x: x.booking_count, reverse=True)
    return results[:limit]
