from tortoise import fields, models

class Post(models.Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField('models.User', related_name='posts')
    trip = fields.ForeignKeyField('models.Trip', related_name='posts', null=True)
    content = fields.TextField()
    likes_count = fields.IntField(default=0)
    comments_count = fields.IntField(default=0)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "posts"
