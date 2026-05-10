from tortoise.models import Model
from tortoise import fields

class SavedDestination(Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField('models.User', related_name='saved_destinations', on_delete=fields.CASCADE)
    city = fields.ForeignKeyField('models.City', related_name='saved_by_users', on_delete=fields.CASCADE)

    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "saved_destinations"
        unique_together = (("user", "city"),)
