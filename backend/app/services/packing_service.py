from fastapi import HTTPException
from app.models.packing import PackingItem
from app.schemas.packing import PackingItemCreate, PackingItemUpdate
from app.services.trip_service import get_trip

async def get_packing_items(trip_id: int, user_id: int):
    await get_trip(trip_id, user_id)
    return await PackingItem.filter(trip_id=trip_id).all()

async def create_packing_item(trip_id: int, user_id: int, item_data: PackingItemCreate):
    await get_trip(trip_id, user_id)
    return await PackingItem.create(trip_id=trip_id, **item_data.model_dump())

async def update_packing_item(trip_id: int, item_id: int, user_id: int, item_data: PackingItemUpdate):
    await get_trip(trip_id, user_id)
    item = await PackingItem.get_or_none(id=item_id, trip_id=trip_id)
    if not item:
        raise HTTPException(status_code=404, detail="Packing item not found")
        
    update_data = item_data.model_dump(exclude_unset=True)
    if update_data:
        await item.update_from_dict(update_data).save()
    return item

async def delete_packing_item(trip_id: int, item_id: int, user_id: int):
    await get_trip(trip_id, user_id)
    item = await PackingItem.get_or_none(id=item_id, trip_id=trip_id)
    if not item:
        raise HTTPException(status_code=404, detail="Packing item not found")
    await item.delete()

async def reset_packing_items(trip_id: int, user_id: int):
    await get_trip(trip_id, user_id)
    items = await PackingItem.filter(trip_id=trip_id).all()
    for item in items:
        item.is_packed = False
        await item.save()
