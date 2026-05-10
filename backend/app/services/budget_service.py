from fastapi import HTTPException
from app.models.budget import BudgetItem
from app.schemas.budget import BudgetItemCreate, BudgetItemUpdate, BudgetSummary
from app.services.trip_service import get_trip

async def get_budget_items(trip_id: int, user_id: int):
    await get_trip(trip_id, user_id)
    return await BudgetItem.filter(trip_id=trip_id).all()

async def get_budget_summary(trip_id: int, user_id: int) -> BudgetSummary:
    await get_trip(trip_id, user_id)
    items = await BudgetItem.filter(trip_id=trip_id).all()
    
    total_spent = sum([float(item.amount) for item in items if item.is_paid])
    total_budget = sum([float(item.amount) for item in items])
    remaining = total_budget - total_spent
    
    by_category = {}
    for item in items:
        by_category[item.category] = by_category.get(item.category, 0.0) + float(item.amount)
        
    return BudgetSummary(
        total_budget=total_budget,
        total_spent=total_spent,
        remaining=remaining,
        by_category=by_category
    )

async def create_budget_item(trip_id: int, user_id: int, item_data: BudgetItemCreate):
    await get_trip(trip_id, user_id)
    return await BudgetItem.create(trip_id=trip_id, **item_data.model_dump())

async def update_budget_item(trip_id: int, item_id: int, user_id: int, item_data: BudgetItemUpdate):
    await get_trip(trip_id, user_id)
    item = await BudgetItem.get_or_none(id=item_id, trip_id=trip_id)
    if not item:
        raise HTTPException(status_code=404, detail="Budget item not found")
        
    update_data = item_data.model_dump(exclude_unset=True)
    if update_data:
        await item.update_from_dict(update_data).save()
    return item

async def delete_budget_item(trip_id: int, item_id: int, user_id: int):
    await get_trip(trip_id, user_id)
    item = await BudgetItem.get_or_none(id=item_id, trip_id=trip_id)
    if not item:
        raise HTTPException(status_code=404, detail="Budget item not found")
    await item.delete()
