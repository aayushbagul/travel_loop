import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_user(async_client: AsyncClient):
    response = await async_client.post("/auth/register", json={
        "email": "test@example.com",
        "name": "Test User",
        "password": "strongpassword"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

@pytest.mark.asyncio
async def test_login_user(async_client: AsyncClient):
    # First register
    await async_client.post("/auth/register", json={
        "email": "login@example.com",
        "password": "password123"
    })
    
    # Then login
    response = await async_client.post("/auth/login", json={
        "email": "login@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_get_me(async_client: AsyncClient):
    # Register and login
    await async_client.post("/auth/register", json={
        "email": "me@example.com",
        "password": "password123"
    })
    login_res = await async_client.post("/auth/login", json={
        "email": "me@example.com",
        "password": "password123"
    })
    token = login_res.json()["access_token"]
    
    # Get me
    response = await async_client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"
