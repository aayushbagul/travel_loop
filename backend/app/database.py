from tortoise import Tortoise
from fastapi import FastAPI
from app.config import get_settings

settings = get_settings()

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
                "aerich.models"
            ],
            "default_connection": "default",
        },
    },
}

async def init_db(app: FastAPI):
    await Tortoise.init(config=TORTOISE_ORM)
    await Tortoise.generate_schemas()

async def close_db():
    await Tortoise.close_connections()
