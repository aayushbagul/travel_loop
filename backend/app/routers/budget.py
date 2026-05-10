from fastapi import APIRouter, Depends, status
from typing import List
from app.schemas.budget import BudgetItemCreate, BudgetItemUpdate, BudgetItemResponse, BudgetSummary
from app.services import budget_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/trips", tags=["Budget"])

@router.get("/{trip_id}/budget/summary", response_model=BudgetSummary)
async def get_budget_summary(trip_id: int, current_user: User = Depends(get_current_user)):
    return await budget_service.get_budget_summary(trip_id, current_user.id)

@router.get("/{trip_id}/budget/items", response_model=List[BudgetItemResponse])
async def get_budget_items(trip_id: int, current_user: User = Depends(get_current_user)):
    return await budget_service.get_budget_items(trip_id, current_user.id)

@router.post("/{trip_id}/budget/items", response_model=BudgetItemResponse, status_code=status.HTTP_201_CREATED)
async def create_budget_item(trip_id: int, item_data: BudgetItemCreate, current_user: User = Depends(get_current_user)):
    return await budget_service.create_budget_item(trip_id, current_user.id, item_data)

@router.put("/{trip_id}/budget/items/{item_id}", response_model=BudgetItemResponse)
async def update_budget_item(trip_id: int, item_id: int, item_data: BudgetItemUpdate, current_user: User = Depends(get_current_user)):
    return await budget_service.update_budget_item(trip_id, item_id, current_user.id, item_data)

@router.delete("/{trip_id}/budget/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget_item(trip_id: int, item_id: int, current_user: User = Depends(get_current_user)):
    await budget_service.delete_budget_item(trip_id, item_id, current_user.id)
