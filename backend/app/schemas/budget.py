from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class BudgetItemBase(BaseModel):
    category: str
    description: str
    amount: float
    currency: Optional[str] = "USD"
    is_paid: Optional[bool] = False
    date_incurred: Optional[date] = None

class BudgetItemCreate(BudgetItemBase):
    pass

class BudgetItemUpdate(BaseModel):
    category: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    is_paid: Optional[bool] = None
    date_incurred: Optional[date] = None

class BudgetItemResponse(BudgetItemBase):
    id: int
    trip_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class BudgetSummary(BaseModel):
    total_budget: float
    total_spent: float
    remaining: float
    by_category: dict[str, float]
