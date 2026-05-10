from fastapi import APIRouter, Depends
from typing import List
from app.schemas.dashboard import DashboardSummary, BudgetAlert
from app.services import dashboard_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummary)
async def get_summary(current_user: User = Depends(get_current_user)):
    return await dashboard_service.get_dashboard_summary(current_user.id)

@router.get("/budget-alerts", response_model=List[BudgetAlert])
async def get_budget_alerts(current_user: User = Depends(get_current_user)):
    return await dashboard_service.get_budget_alerts(current_user.id)
