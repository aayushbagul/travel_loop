from tortoise.models import Model
from tortoise import fields

class Trip(Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField('models.User', related_name='trips')
    title = fields.CharField(max_length=255)
    description = fields.TextField(null=True)
    start_date = fields.DateField(null=True)
    end_date = fields.DateField(null=True)
    cover_photo = fields.CharField(max_length=512, null=True)
    
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "trips"
