from fastapi import HTTPException
from app.models.budget import BudgetItem
from app.models.user import User
from app.schemas.budget import BudgetItemCreate, BudgetItemUpdate, BudgetSummary
from app.services.trip_service import get_trip

async def get_budget_items(trip_id: int, user: User):
    await get_trip(trip_id, user)
    return await BudgetItem.filter(trip_id=trip_id).all()

async def get_budget_summary(trip_id: int, user: User) -> BudgetSummary:
    await get_trip(trip_id, user)
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

async def create_budget_item(trip_id: int, current_user: User, item_data: BudgetItemCreate):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can manually add custom expenses")
    await get_trip(trip_id, current_user)
    return await BudgetItem.create(trip_id=trip_id, **item_data.model_dump())

async def update_budget_item(trip_id: int, item_id: int, current_user: User, item_data: BudgetItemUpdate):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can update invoices manually")
    await get_trip(trip_id, current_user)
    item = await BudgetItem.get_or_none(id=item_id, trip_id=trip_id)
    if not item:
        raise HTTPException(status_code=404, detail="Budget item not found")
        
    update_data = item_data.model_dump(exclude_unset=True)        
    if update_data:
        await item.update_from_dict(update_data).save()
    return item

async def delete_budget_item(trip_id: int, item_id: int, current_user: User):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can delete invoices manually")
    await get_trip(trip_id, current_user)
    item = await BudgetItem.get_or_none(id=item_id, trip_id=trip_id)
    if not item:
        raise HTTPException(status_code=404, detail="Budget item not found")
    await item.delete()
