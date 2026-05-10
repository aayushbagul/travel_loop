from tortoise.models import Model
from tortoise import fields

class Activity(Model):
    id = fields.IntField(pk=True)
    city = fields.ForeignKeyField('models.City', related_name='activities')
    name = fields.CharField(max_length=255)
    type = fields.CharField(max_length=100) # e.g. "Sightseeing", "Food", "Adventure"
    description = fields.TextField(null=True)
    image_url = fields.CharField(max_length=512, null=True)
    duration_minutes = fields.IntField(null=True)
    price_estimate = fields.DecimalField(max_digits=10, decimal_places=2, null=True)

    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "activities"
