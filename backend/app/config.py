from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "Travel Loop"
    DATABASE_URL: str = "sqlite://db.sqlite3"
    SECRET_KEY: str = "supersecretkey_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week for hackathon

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
