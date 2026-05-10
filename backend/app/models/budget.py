from tortoise.models import Model
from tortoise import fields

class BudgetItem(Model):
    id = fields.IntField(pk=True)
    trip = fields.ForeignKeyField('models.Trip', related_name='budget_items', on_delete=fields.CASCADE)
    
    category = fields.CharField(max_length=100) # e.g. "Flight", "Hotel", "Food", "Transport"
    description = fields.CharField(max_length=255)
    amount = fields.DecimalField(max_digits=12, decimal_places=2)
    currency = fields.CharField(max_length=10, default="USD")
    
    is_paid = fields.BooleanField(default=False)
    date_incurred = fields.DateField(null=True)

    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "budget_items"
