import pytest
from app import create_app
from models import db, Stop

@pytest.fixture
def app():
    app = create_app(testing=True)
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_stop_creation_and_query(client, monkeypatch):
    # Mock scrape_stops_for_system to return static data
    monkeypatch.setattr('app.scrape_stops_for_system', lambda system: [
        {"name": "Union Station", "line": "GO", "system": "GO Transit"},
        {"name": "Kipling", "line": "TTC", "system": "TTC"},
        {"name": "Yorkdale", "line": "TTC", "system": "TTC"},
        {"name": "Oakville", "line": "GO", "system": "GO Transit"},
    ])
    # Add a stop
    stop = Stop(name="Union Station", line="GO", system="GO Transit", lat=43.645, lon=-79.380)
    db.session.add(stop)
    db.session.commit()
    # Query by name
    response = client.get('/api/stops?name=Union')
    assert response.status_code == 200
    data = response.get_json()
    assert any(s['name'] == 'Union Station' for s in data)
    # Query by system
    response = client.get('/api/stops?system=GO Transit')
    assert response.status_code == 200
    data = response.get_json()
    assert any(s['system'] == 'GO Transit' for s in data)

def test_stop_scraping_and_persistence(client, monkeypatch):
    # Mock scrape_stops_for_system to return static data
    monkeypatch.setattr('app.scrape_stops_for_system', lambda system: [
        {"name": "Kipling", "line": "TTC", "system": "TTC"},
        {"name": "Yorkdale", "line": "TTC", "system": "TTC"},
        {"name": "Bloor-Yonge", "line": "TTC", "system": "TTC"},
    ])
    from app import scrape_stops_for_system
    stops = scrape_stops_for_system("TTC")
    for s in stops:
        stop = Stop(name=s['name'], line=s['line'], system=s['system'])
        db.session.add(stop)
    db.session.commit()
    # Query for a scraped stop
    response = client.get('/api/stops?system=TTC')
    assert response.status_code == 200
    data = response.get_json()
    assert any(s['name'] == 'Kipling' for s in data)
    assert all(s['system'] == 'TTC' for s in data)
