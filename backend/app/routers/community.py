from fastapi import APIRouter, Depends, status
from typing import List
from app.schemas.post import PostCreate, PostResponse
from app.services import community_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/community", tags=["Community"])

@router.get("/posts", response_model=List[PostResponse])
async def get_posts():
    return await community_service.get_all_posts()

@router.post("/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(post_data: PostCreate, current_user: User = Depends(get_current_user)):
    return await community_service.create_post(current_user.id, post_data)

@router.put("/posts/{post_id}/like", response_model=PostResponse)
async def like_post(post_id: int, current_user: User = Depends(get_current_user)):
    return await community_service.like_post(post_id)
