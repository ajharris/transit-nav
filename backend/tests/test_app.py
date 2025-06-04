# tests/test_app.py
import pytest
from app import create_app

def test_app_creation():
    app = create_app(testing=True)
    assert app is not None
    assert app.config['TESTING'] or app.config['SQLALCHEMY_DATABASE_URI'].startswith('sqlite')


def test_app_routes_registered():
    app = create_app(testing=True)
    client = app.test_client()
    resp = client.get('/api/health')
    assert resp.status_code == 200
    assert resp.get_json() == {"status": "ok"}
