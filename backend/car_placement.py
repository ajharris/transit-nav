# Car placement data and normalization logic

CAR_PLACEMENT = {
    "union station": {
        "front street": {
            "car": 3,
            "notes": "Stairs to Front Street and Bay St. are closest to car 3 (center of platform).",
            "explanation": "Use car 3 — closest to Front Street exit stairs."
        },
        "york concourse": {
            "car": [2, 3],
            "notes": "Both cars 2 and 3 are near the York Concourse escalators.",
            "explanation": "Use car 2 or 3 — both are close to York Concourse exit."
        }
    },
    "multioption": {
        "central": {
            "car": [2, 3],
            "notes": "Either car 2 or 3 is optimal for Central exit.",
            "explanation": "Use car 2 or 3 — both are close to Central exit."
        }
    },
    "underconstruction": {
        "main": None  # Simulate missing data
    },
    "bloor-yonge": {
        "yonge": {
            "car": 4,
            "notes": "Specify line: Bloor or Yonge.",
            "explanation": "Please clarify which line you are on at Bloor-Yonge."
        }
    },
    "st george": {
        "bedford": {
            "car": 2,
            "notes": "Bedford exit is closest to car 2.",
            "explanation": "Use car 2 — closest to Bedford exit stairs."
        }
    }
}

def normalize_station_name(name):
    if not name:
        return None
    name = name.lower().replace('.', '').replace('-', ' ').replace('_', ' ').strip()
    # Simple typo/variant handling
    if name in ("st george", "st george station", "st. george", "st. george station"):
        return "st george"
    if name in ("union", "union station"):
        return "union station"
    if name in ("multioption", ):
        return "multioption"
    if name in ("underconstruction", "under construction"):
        return "underconstruction"
    if name in ("bloor-yonge", "bloor yonge", "bloor yonge station"):
        return "bloor-yonge"
    return name
