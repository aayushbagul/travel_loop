"""
Authentication dependencies for FastAPI routes.
Provides reusable dependency functions to secure endpoints and extract user information from JWT tokens.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.config import get_settings
from app.models.user import User

settings = get_settings()

# Defines the security scheme for OpenAPI and specifies the endpoint clients should use to get a token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    Validates the bearer token from the request header and retrieves the associated user.
    Can be injected into any route that requires authentication.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the JWT token to extract the payload using the secret key and algorithm
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        # Catch any token validation errors like expiration or invalid signatures
        raise credentials_exception
        
    # Query the database to ensure the user still exists
    user = await User.filter(email=email).first()
    if user is None:
        raise credentials_exception
        
    # Prevent suspended users from accessing authenticated routes
    if user.is_suspended:
        raise HTTPException(status_code=403, detail="User is suspended")
        
    return user
