# tests/test_api.py
import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app(testing=True)
    return app.test_client()

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}

def test_supported_systems(client):
    response = client.get("/api/supported_systems")
    assert response.status_code == 200
    data = response.get_json()
    assert "systems" in data
    assert isinstance(data["systems"], list)
    # Check at least one expected system
    ids = {sys["id"] for sys in data["systems"]}
    assert "go" in ids and "ttc" in ids
    # Check each item has id and name
    for sys in data["systems"]:
        assert "id" in sys and "name" in sys
