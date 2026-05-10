from tortoise.models import Model
from tortoise import fields

class Stop(Model):
    id = fields.IntField(pk=True)
    trip = fields.ForeignKeyField('models.Trip', related_name='stops', on_delete=fields.CASCADE)
    city = fields.ForeignKeyField('models.City', related_name='stops')
    
    order = fields.IntField()
    start_date = fields.DateField(null=True)
    end_date = fields.DateField(null=True)
    
    notes = fields.TextField(null=True)

    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "stops"
        ordering = ["order"]
