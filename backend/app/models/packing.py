from tortoise.models import Model
from tortoise import fields

class PackingItem(Model):
    id = fields.IntField(pk=True)
    trip = fields.ForeignKeyField('models.Trip', related_name='packing_items', on_delete=fields.CASCADE)
    
    name = fields.CharField(max_length=255)
    quantity = fields.IntField(default=1)
    is_packed = fields.BooleanField(default=False)
    
    category = fields.CharField(max_length=100, null=True)

    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "packing_items"
