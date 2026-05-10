from tortoise.models import Model
from tortoise import fields

class Note(Model):
    id = fields.IntField(pk=True)
    trip = fields.ForeignKeyField('models.Trip', related_name='notes', on_delete=fields.CASCADE)
    
    title = fields.CharField(max_length=255)
    content = fields.TextField()
    
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "notes"
