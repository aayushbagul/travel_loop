import pytest
from httpx import AsyncClient

@pytest.fixture
async def auth_token(async_client: AsyncClient):
    await async_client.post("/auth/register", json={
        "email": "tripuser@example.com",
        "password": "password123"
    })
    res = await async_client.post("/auth/login", json={
        "email": "tripuser@example.com",
        "password": "password123"
    })
    return res.json()["access_token"]

@pytest.mark.asyncio
async def test_create_trip(async_client: AsyncClient, auth_token: str):
    response = await async_client.post(
        "/trips",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={
            "title": "Summer Vacation",
            "description": "Trip to Hawaii",
            "start_date": "2024-07-01",
            "end_date": "2024-07-15"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Summer Vacation"
    assert "id" in data

@pytest.mark.asyncio
async def test_get_trips(async_client: AsyncClient, auth_token: str):
    # Create trip
    await async_client.post(
        "/trips",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"title": "Trip 1"}
    )
    
    # Get trips
    response = await async_client.get(
        "/trips",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["title"] == "Trip 1"
