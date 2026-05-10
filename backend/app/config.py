from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """
    Main settings class for the application.
    Fields defined here can be overridden by environment variables in the .env file.
    """
    PROJECT_NAME: str = "Travel Loop"
    DATABASE_URL: str = "sqlite://db.sqlite3"
    SECRET_KEY: str = "supersecretkey_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    """
    Returns a cached instance of the Settings class.
    lru_cache ensures the .env file is read only once during the application startup,
    improving performance on subsequent calls.
    """
    return Settings()
