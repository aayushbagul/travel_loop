from tortoise.models import Model
from tortoise import fields

class Collaborator(Model):
    id = fields.IntField(pk=True)
    trip = fields.ForeignKeyField('models.Trip', related_name='collaborators', on_delete=fields.CASCADE)
    user = fields.ForeignKeyField('models.User', related_name='shared_trips', on_delete=fields.CASCADE, null=True)
    
    email = fields.CharField(max_length=255, null=True) # If invited but not registered yet
    role = fields.CharField(max_length=50, default="viewer") # "viewer", "editor"
    share_token = fields.CharField(max_length=255, unique=True, null=True)
    
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "collaborators"
