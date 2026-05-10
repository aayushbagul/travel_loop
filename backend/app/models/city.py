from tortoise.models import Model
from tortoise import fields

class City(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
    country = fields.CharField(max_length=255, null=True)
    description = fields.TextField(null=True)
    image_url = fields.CharField(max_length=512, null=True)
    
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "cities"
