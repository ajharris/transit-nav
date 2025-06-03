from flask import Flask, send_from_directory, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from models import db, Stop
import os

# --- Car Placement Data ---
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

def scrape_stops_for_system(system_name):
    """
    Placeholder for web scraping logic. In production, this would fetch and parse stops from the web.
    For testing, this can be mocked.
    """
    # Example: return a list of stops for TTC
    if system_name == "TTC":
        return [
            {"name": "Kipling", "line": "TTC", "system": "TTC"},
            {"name": "Yorkdale", "line": "TTC", "system": "TTC"},
            {"name": "Union Station", "line": "GO", "system": "GO Transit"},
            {"name": "Bloor-Yonge", "line": "TTC", "system": "TTC"},
        ]
    return []

def create_app(testing=False):
    app = Flask(__name__, static_folder='../frontend/build', static_url_path='')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///transitnav.db' if not testing else 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    with app.app_context():
        db.create_all()

    @app.route('/')
    @app.route('/<path:path>')
    def serve_react(path=''):
        # Always return index.html for root or unknown paths (SPA fallback)
        if not path:
            index_path = os.path.join(app.static_folder, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(app.static_folder, 'index.html')
            else:
                return '', 404

        normalized_path = os.path.normpath(os.path.join(app.static_folder, path))
        if normalized_path.startswith(app.static_folder) and os.path.exists(normalized_path):
            return send_from_directory(app.static_folder, path)

        # Serve favicon.ico if requested and present in static folder
        if path == 'favicon.ico':
            favicon_path = os.path.join(app.static_folder, 'favicon.ico')
            if os.path.exists(favicon_path):
                return send_from_directory(app.static_folder, 'favicon.ico')
            else:
                return '', 404

        return '', 404

    @app.route('/api/health')
    def health_check():
        return {"status": "ok"}

    @app.route('/api/supported_systems')
    def supported_systems():
        # Static mock list for MVP
        systems = [
            {"id": "go", "name": "GO Transit"},
            {"id": "ttc", "name": "TTC"},
            {"id": "mta", "name": "MTA"},
            {"id": "bart", "name": "BART"},
        ]
        return {"systems": systems}

    @app.route('/api/stops')
    def stops():
        name = request.args.get('name')
        line = request.args.get('line')
        system = request.args.get('system')
        query = Stop.query
        if name:
            query = query.filter(Stop.name.ilike(f"%{name}%"))
        if line:
            query = query.filter(Stop.line.ilike(f"%{line}%"))
        if system:
            query = query.filter(Stop.system.ilike(f"%{system}%"))
        stops = query.all()
        return jsonify([stop.to_dict() for stop in stops]), 200

    def normalize_station_name(name):
        if not name:
            return None
        name = name.lower().replace('.', '').replace('-', ' ').replace('_', ' ').strip()
        # Simple typo/variant handling
        if name in ("st george", "st george station", "st. george", "st. george station"):
            return "st george"
        if name in ("union", "union station"):
            return "union station"
        if name in ("multioption",):
            return "multioption"
        if name in ("underconstruction", "under construction"):
            return "underconstruction"
        if name in ("bloor-yonge", "bloor yonge", "bloor yonge station"):
            return "bloor-yonge"
        return name

    @app.route('/api/best_car')
    def best_car():
        station = request.args.get('station', '').strip()
        exit_name = request.args.get('exit', '').strip()
        line = request.args.get('line', '').strip() if 'line' in request.args else None
        norm_station = normalize_station_name(station)
        if not norm_station or norm_station not in CAR_PLACEMENT:
            return jsonify({"error": f"Station '{station}' not found."}), 404
        station_data = CAR_PLACEMENT[norm_station]
        if not exit_name:
            exits = list(station_data.keys())
            return jsonify({"error": f"Please specify an exit. Options: {', '.join(exits)}."}), 400
        norm_exit = exit_name.lower().replace('.', '').replace('-', ' ').replace('_', ' ').strip()
        # Find best match for exit
        exit_key = None
        for k in station_data:
            if norm_exit in k:
                exit_key = k
                break
        if not exit_key:
            # Try exact match
            if norm_exit in station_data:
                exit_key = norm_exit
            else:
                return jsonify({"error": f"Exit '{exit_name}' not found for station '{station}'."}), 404
        car_info = station_data[exit_key]
        if car_info is None:
            return jsonify({"error": "Information not available yet."}), 503
        # Multi-line station edge case
        if norm_station == "bloor-yonge" and not line:
            return jsonify({"error": "Bloor-Yonge serves multiple lines. Please clarify which line you are on."}), 400
        # Compose response
        resp = {
            "station": norm_station,
            "exit": exit_key,
            "car": car_info["car"] if isinstance(car_info["car"], list) or isinstance(car_info["car"], int) else None,
            "explanation": car_info["explanation"],
            "notes": car_info["notes"]
        }
        return jsonify(resp), 200

    return app
