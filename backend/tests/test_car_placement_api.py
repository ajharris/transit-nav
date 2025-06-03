# tests/test_car_placement_api.py
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app(testing=True)
    return app.test_client()

def test_best_car_basic(client):
    # 1. Returns best car for given station and exit
    response = client.get('/api/best_car?station=Union%20Station&exit=Front%20Street')
    assert response.status_code == 200
    data = response.get_json()
    assert data['station'].lower().startswith('union')
    assert data['exit'].lower().startswith('front')
    assert 'car' in data
    assert 'explanation' in data
    assert 'Use car' in data['explanation']

def test_best_car_multiple_options(client):
    # 2. Returns multiple best cars if more than one
    response = client.get('/api/best_car?station=MultiOption&exit=Central')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data['car'], list)
    assert len(data['car']) > 1
    assert 'or' in data['explanation']

def test_best_car_notes(client):
    # 3. Returns notes for car recommendation
    response = client.get('/api/best_car?station=Union%20Station&exit=Front%20Street')
    data = response.get_json()
    assert 'notes' in data
    assert isinstance(data['notes'], str)

def test_station_not_found(client):
    # 4. Station not in database
    response = client.get('/api/best_car?station=Unknownville&exit=Main')
    assert response.status_code == 404
    data = response.get_json()
    assert 'error' in data
    assert 'not found' in data['error'].lower()

def test_exit_ambiguous(client):
    # 5. Exit ambiguous or missing
    response = client.get('/api/best_car?station=Union%20Station&exit=')
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert 'specify' in data['error'].lower() or 'ambiguous' in data['error'].lower()

def test_station_typo(client):
    # 6. Station name typo is handled
    response = client.get('/api/best_car?station=St.%20George&exit=Bedford')
    assert response.status_code == 200
    data = response.get_json()
    assert data['station'].lower().startswith('st george')

def test_under_construction(client):
    # 7. Station under construction
    response = client.get('/api/best_car?station=UnderConstruction&exit=Main')
    assert response.status_code == 503
    data = response.get_json()
    assert 'information not available' in data['error'].lower()

def test_multiline_station(client):
    # 8. Multi-line station requires line info
    response = client.get('/api/best_car?station=Bloor-Yonge&exit=Yonge')
    assert response.status_code == 400
    data = response.get_json()
    assert 'which line' in data['error'].lower() or 'clarify' in data['error'].lower()
