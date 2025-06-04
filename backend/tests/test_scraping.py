# tests/test_scraping.py
import pytest
from scraping import scrape_stops_for_system

class DummyResponse:
    def __init__(self, text, status_code=200):
        self.text = text
        self.status_code = status_code
    def raise_for_status(self):
        if self.status_code != 200:
            raise Exception("HTTP error")

# Patch requests.get to simulate network failures and edge cases
def test_scrape_stops_returns_static_on_failure(monkeypatch):
    monkeypatch.setattr('scraping.requests.get', lambda *a, **kw: (_ for _ in ()).throw(Exception("fail")))
    stops = scrape_stops_for_system("TTC")
    assert isinstance(stops, list)
    assert any(s['name'] == 'Union Station' for s in stops)

def test_scrape_stops_returns_static_on_empty(monkeypatch):
    class FakeResp:
        def __init__(self): self.text = ''
        def raise_for_status(self): pass
    monkeypatch.setattr('scraping.requests.get', lambda *a, **kw: FakeResp())
    stops = scrape_stops_for_system("TTC")
    assert isinstance(stops, list)
    assert any(s['name'] == 'Union Station' for s in stops)

def test_scrape_stops_supported_systems():
    for sys in ["TTC", "GO Transit", "MTA", "BART"]:
        stops = scrape_stops_for_system(sys)
        assert isinstance(stops, list)
        assert all('name' in s for s in stops)
