# tests/test_car_placement.py
import pytest
from car_placement import CAR_PLACEMENT, normalize_station_name

def test_normalize_station_name_basic():
    assert normalize_station_name("Union Station") == "union station"
    assert normalize_station_name("  UNION station  ") == "union station"
    assert normalize_station_name("Bloor-Yonge") == "bloor-yonge"

def test_car_placement_structure():
    assert isinstance(CAR_PLACEMENT, dict)
    for station, exits in CAR_PLACEMENT.items():
        assert isinstance(exits, dict)
        for exit_name, info in exits.items():
            assert info is not None, f"Exit '{exit_name}' for station '{station}' is None"
            assert 'car' in info, f"Missing 'car' in {station} {exit_name}"
            assert 'explanation' in info, f"Missing 'explanation' in {station} {exit_name}"

def test_car_placement_multioption():
    # Test multioption structure
    assert 'multioption' in CAR_PLACEMENT
    assert 'central' in CAR_PLACEMENT['multioption']
    info = CAR_PLACEMENT['multioption']['central']
    assert isinstance(info['car'], list)
    assert info['explanation']
