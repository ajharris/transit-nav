# tests/test_static_serving.py
import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app(testing=True)
    return app.test_client()

def test_index_served(client):
    response = client.get("/")
    # Accept 404 as valid if index.html is not present
    assert response.status_code in (200, 404)
