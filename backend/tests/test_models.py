# tests/test_models.py
import pytest
from app import create_app
from models import db, TransitSystem, Line, Stop

@pytest.fixture
def app():
    app = create_app(testing=True)
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def session(app):
    with app.app_context():
        yield db.session

def test_transit_system_model(session):
    sys = TransitSystem(name="Test System", region="Test Region")
    session.add(sys)
    session.commit()
    assert sys.id is not None
    assert sys.name == "Test System"

def test_line_model(session):
    sys = TransitSystem(name="Sys2")
    session.add(sys)
    session.commit()
    line = Line(name="Line1", system=sys)
    session.add(line)
    session.commit()
    assert line.id is not None
    assert line.system == sys

def test_stop_model(session):
    sys = TransitSystem(name="Sys3")
    session.add(sys)
    session.commit()
    stop = Stop(name="Stop1", line="L1", system="Sys3", lat=1.0, lon=2.0)
    session.add(stop)
    session.commit()
    assert stop.id is not None
    assert stop.name == "Stop1"
