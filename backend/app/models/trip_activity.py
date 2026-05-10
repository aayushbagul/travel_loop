from tortoise.models import Model
from tortoise import fields

class TripActivity(Model):
    id = fields.IntField(pk=True)
    stop = fields.ForeignKeyField('models.Stop', related_name='activities', on_delete=fields.CASCADE)
    activity = fields.ForeignKeyField('models.Activity', related_name='stop_activities')
    
    date = fields.DateField(null=True)
    start_time = fields.TimeField(null=True)
    end_time = fields.TimeField(null=True)
    notes = fields.TextField(null=True)

    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "trip_activities"
