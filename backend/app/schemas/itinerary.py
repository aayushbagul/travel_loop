from pydantic import BaseModel
from typing import List
from app.schemas.stop import StopResponse
from app.schemas.trip_activity import TripActivityResponse
from app.schemas.trip import TripResponse

class ItineraryStop(StopResponse):
    trip_activities: List[TripActivityResponse] = []

class ItineraryResponse(BaseModel):
    trip: TripResponse
    stops: List[ItineraryStop]
