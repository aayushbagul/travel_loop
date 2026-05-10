from tortoise import Tortoise
from fastapi import FastAPI
from app.config import get_settings

settings = get_settings()

# Tortoise ORM configuration dictionary.
# Specifies the database connection details and the paths to all the model classes.
TORTOISE_ORM = {
    "connections": {"default": settings.DATABASE_URL},
    "apps": {
        "models": {
            "models": [
                "app.models.user",
                "app.models.trip",
                "app.models.stop",
                "app.models.city",
                "app.models.activity",
                "app.models.trip_activity",
                "app.models.budget",
                "app.models.packing",
                "app.models.note",
                "app.models.saved_destination",
                "app.models.collaborator",
                "aerich.models" # Used by aerich for database migrations
            ],
            "default_connection": "default",
        },
    },
}

async def init_db(app: FastAPI):
    """
    Initialize the database connection and generate schemas.
    To be called during the startup event of the FastAPI application.
    """
    await Tortoise.init(config=TORTOISE_ORM)
    await Tortoise.generate_schemas()

async def close_db():
    """
    Close all database connections safely.
    To be called during the shutdown event of the FastAPI application.
    """
    await Tortoise.close_connections()
