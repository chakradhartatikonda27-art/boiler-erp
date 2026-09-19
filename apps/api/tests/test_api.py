import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database import engine, Base
from app.seed import seed_db

@pytest_asyncio.fixture(autouse=True, scope="function")
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_db()

@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_admin_login():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/auth/login", json={
            "email": "admin@example.com",
            "password": "admin123"
        })
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["user"]["role"] == "ADMIN"

@pytest.mark.asyncio
async def test_dashboard_kpis():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        login_res = await ac.post("/api/auth/login", json={
            "email": "admin@example.com",
            "password": "admin123"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        res = await ac.get("/api/dashboard", headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert "kpis" in data
        assert data["kpis"]["active_flocks_count"] >= 1

@pytest.mark.asyncio
async def test_farmer_crud():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        login_res = await ac.post("/api/auth/login", json={
            "email": "admin@example.com",
            "password": "admin123"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Create Farmer
        res = await ac.post("/api/farmers", json={
            "full_name": "Satyanarayana Raju",
            "mobile": "+91-9876500112",
            "address": "Farm House, Yellamanchili",
            "state": "Andhra Pradesh",
            "district": "Visakhapatnam",
            "mandal": "Yellamanchili"
        }, headers=headers)
        assert res.status_code == 200
        farmer = res.json()
        assert farmer["full_name"] == "Satyanarayana Raju"
        assert farmer["farmer_code"].startswith("AN-VIS-")

@pytest.mark.asyncio
async def test_growing_charges_calculation():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        login_res = await ac.post("/api/auth/login", json={
            "email": "admin@example.com",
            "password": "admin123"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Fetch active flocks
        flock_res = await ac.get("/api/flocks", headers=headers)
        flocks = flock_res.json()
        assert len(flocks) > 0
        flock_id = flocks[0]["id"]

        # Calculate GC
        calc_res = await ac.post(f"/api/growing-charges/flock/{flock_id}/calculate?assigned_grade=A", headers=headers)
        assert calc_res.status_code == 200
        gc_data = calc_res.json()
        assert gc_data["final_gc_amount"] > 0
        assert "breakdown_json" in gc_data
