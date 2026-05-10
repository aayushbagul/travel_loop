from fastapi import HTTPException
from app.models.city import City
from typing import List

async def get_cities() -> List[City]:
    return await City.all()

async def get_city(city_id: int) -> City:
    city = await City.get_or_none(id=city_id)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city
