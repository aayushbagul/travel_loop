import pytest
from httpx import AsyncClient
from tortoise import Tortoise
from app.main import app
import asyncio

DB_URL = "sqlite://:memory:"

async def init_db():
    await Tortoise.init(
        db_url=DB_URL,
        modules={"models": [
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
        ]}
    )
    await Tortoise.generate_schemas()

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(autouse=True)
async def initialize_tests():
    await init_db()
    yield
    await Tortoise._drop_databases()
    await Tortoise.close_connections()

from httpx import ASGITransport

@pytest.fixture
async def async_client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client
