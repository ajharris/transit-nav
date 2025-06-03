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

def test_get_transit_systems_returns_expected_data(client):
    response = client.get('/api/transit_systems')
    assert response.status_code == 200
    systems = response.get_json()
    assert isinstance(systems, list)
    for system in systems:
        assert 'id' in system
        assert 'name' in system
        assert 'region' in system

def test_get_stops_valid_system(client):
    response = client.get('/api/stops?system=ttc')
    assert response.status_code == 200
    stops = response.get_json()
    assert isinstance(stops, list)
    for stop in stops:
        assert 'id' in stop
        assert 'name' in stop
        assert 'location' in stop

def test_get_stops_missing_system_param(client):
    response = client.get('/api/stops')
    assert response.status_code == 400

def test_get_best_car_valid(client):
    response = client.get('/api/best_car?origin=MainStreet&destination=Union')
    assert response.status_code == 200
    data = response.get_json()
    assert 'recommended_car' in data
    assert 'notes' in data

def test_get_best_car_missing_params(client):
    response = client.get('/api/best_car')
    assert response.status_code == 400

def test_get_best_car_invalid_stops(client):
    response = client.get('/api/best_car?origin=FakeStop&destination=Nowhere')
    assert response.status_code in (400, 404)
