from tortoise.models import Model
from tortoise import fields

class User(Model):
    id = fields.IntField(pk=True)
    email = fields.CharField(max_length=255, unique=True)
    hashed_password = fields.CharField(max_length=255)
    name = fields.CharField(max_length=255, null=True)
    profile_photo = fields.CharField(max_length=512, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    
    is_active = fields.BooleanField(default=True)
    is_suspended = fields.BooleanField(default=False)

    class Meta:
        table = "users"
