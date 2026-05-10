from pydantic import BaseModel
from typing import List

class DashboardSummary(BaseModel):
    upcoming_trips_count: int
    past_trips_count: int
    saved_destinations_count: int
    total_countries_visited: int

class BudgetAlert(BaseModel):
    trip_id: int
    trip_title: str
    total_budget: float
    total_spent: float
    percentage_used: float
    is_over_budget: bool
