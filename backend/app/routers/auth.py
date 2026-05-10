"""
Authentication router.
Provides endpoints for user registration, login, and fetching the current user profile.
"""

from fastapi import APIRouter, Depends, status
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import LoginRequest, Token
from app.services.auth_service import register_user, authenticate_user
from app.dependencies.auth import get_current_user
from app.models.user import User

# Initialize the router with a prefix and a tag for OpenAPI documentation
router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """
    Registers a new user and returns the created user details.
    Delegates the core business logic to the auth_service.
    """
    user = await register_user(user_data)
    return user

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    """
    Authenticates a user using email and password.
    Returns a JWT bearer token upon successful login.
    """
    return await authenticate_user(login_data)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Fetches the profile of the currently authenticated user.
    Requires a valid JWT token in the Authorization header.
    """
    return current_user
