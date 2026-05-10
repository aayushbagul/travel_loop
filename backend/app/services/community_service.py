from fastapi import HTTPException
from app.models.post import Post
from app.models.trip import Trip
from app.schemas.post import PostCreate

async def get_all_posts():
    return await Post.all().order_by('-created_at').prefetch_related('user', 'trip')

async def create_post(user_id: int, post_data: PostCreate):
    if post_data.trip_id:
        trip = await Trip.get_or_none(id=post_data.trip_id)
        if not trip or trip.user_id != user_id:
            raise HTTPException(status_code=403, detail="Cannot link a trip you don't own")
            
    post = await Post.create(user_id=user_id, **post_data.model_dump())
    await post.fetch_related('user', 'trip')
    return post

async def like_post(post_id: int):
    post = await Post.get_or_none(id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.likes_count += 1
    await post.save()
    await post.fetch_related('user', 'trip')
    return post
