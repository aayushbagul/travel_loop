from app.models.trip import Trip
from app.models.saved_destination import SavedDestination
from app.models.budget import BudgetItem
from app.models.stop import Stop
from app.schemas.dashboard import DashboardSummary, BudgetAlert
from datetime import date

async def get_dashboard_summary(user_id: int) -> DashboardSummary:
    today = date.today()
    
    # Upcoming trips: start_date > today OR (start_date is null but created_at is recent) - simplified
    upcoming_trips = await Trip.filter(user_id=user_id, start_date__gte=today).count()
    past_trips = await Trip.filter(user_id=user_id, end_date__lt=today).count()
    
    saved_dests = await SavedDestination.filter(user_id=user_id).count()
    
    # Countries visited: unique countries from past trip stops
    past_trips_list = await Trip.filter(user_id=user_id, end_date__lt=today).all()
    past_trip_ids = [t.id for t in past_trips_list]
    
    countries_visited = 0
    if past_trip_ids:
        stops = await Stop.filter(trip_id__in=past_trip_ids).prefetch_related('city').all()
        countries = set(stop.city.country for stop in stops if stop.city.country)
        countries_visited = len(countries)
        
    return DashboardSummary(
        upcoming_trips_count=upcoming_trips,
        past_trips_count=past_trips,
        saved_destinations_count=saved_dests,
        total_countries_visited=countries_visited
    )

async def get_budget_alerts(user_id: int) -> list[BudgetAlert]:
    # Get all active trips for user
    today = date.today()
    active_trips = await Trip.filter(user_id=user_id, end_date__gte=today).all()
    
    alerts = []
    for trip in active_trips:
        items = await BudgetItem.filter(trip_id=trip.id).all()
        if not items:
            continue
            
        total_budget = sum([float(item.amount) for item in items])
        total_spent = sum([float(item.amount) for item in items if item.is_paid])
        
        if total_budget > 0:
            percentage = (total_spent / total_budget) * 100
            if percentage >= 80: # Alert if 80% or more used
                alerts.append(BudgetAlert(
                    trip_id=trip.id,
                    trip_title=trip.title,
                    total_budget=total_budget,
                    total_spent=total_spent,
                    percentage_used=percentage,
                    is_over_budget=(percentage > 100)
                ))
    return alerts
