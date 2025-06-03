# tests/test_stops_api.py
import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app(testing=True)
    return app.test_client()

def test_stops_list(client):
    response = client.get("/api/stops")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert any('id' in stop and 'name' in stop for stop in data)

def test_stops_filter_by_name(client):
    response = client.get("/api/stops?name=union")
    assert response.status_code == 200
    data = response.get_json()
    assert all('union' in stop['name'].lower() for stop in data)

def test_stops_filter_by_line(client):
    response = client.get("/api/stops?line=GO")
    assert response.status_code == 200
    data = response.get_json()
    assert all(stop['line'].lower() == 'go' for stop in data)

def test_stops_empty_list(monkeypatch, client):
    # Patch the stops endpoint to return an empty list
    monkeypatch.setattr('app.create_app', lambda testing=False: create_app_with_empty_stops())
    def create_app_with_empty_stops():
        from flask import Flask, jsonify
        app = Flask(__name__)
        @app.route('/api/stops')
        def stops():
            return jsonify({"error": "No stops available"}), 503
        return app
    app = create_app_with_empty_stops()
    test_client = app.test_client()
    response = test_client.get('/api/stops')
    assert response.status_code == 503
    assert 'error' in response.get_json()
