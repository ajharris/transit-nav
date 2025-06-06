# tests/test_routes.py
import pytest
from app import create_app
from flask import url_for

@pytest.fixture
def client():
    app = create_app(testing=True)
    return app.test_client()

def test_root_serves_index_or_404(client):
    resp = client.get('/')
    assert resp.status_code in (200, 404)

def test_health_check_route(client):
    resp = client.get('/api/health')
    assert resp.status_code == 200
    assert resp.get_json() == {"status": "ok"}

def test_unknown_route(client):
    resp = client.get('/some-nonexistent-path')
    assert resp.status_code in (200, 404)
