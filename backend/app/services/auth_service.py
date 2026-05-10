from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate
from app.schemas.auth import LoginRequest
from app.utils.security import get_password_hash, verify_password
from app.utils.token import create_access_token

async def register_user(user_data: UserCreate) -> User:
    # Check if user already exists
    existing_user = await User.filter(email=user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)
    user = await User.create(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password
    )
    return user

async def authenticate_user(login_data: LoginRequest):
    user = await User.filter(email=login_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
