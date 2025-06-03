from flask import Flask, send_from_directory, request, jsonify
import os

def create_app(testing=False):
    app = Flask(__name__, static_folder='../frontend/build', static_url_path='')

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
        # Example static stop list for MVP
        stops = [
            {"id": "union", "name": "Union Station", "location": {"lat": 43.645, "lon": -79.380}, "line": "GO"},
            {"id": "kipling", "name": "Kipling", "location": {"lat": 43.636, "lon": -79.535}, "line": "TTC"},
            {"id": "yorkdale", "name": "Yorkdale", "location": {"lat": 43.724, "lon": -79.454}, "line": "TTC"},
            {"id": "oakville", "name": "Oakville", "location": {"lat": 43.450, "lon": -79.682}, "line": "GO"},
        ]
        # Optional: filter by name or line
        name = request.args.get('name')
        line = request.args.get('line')
        filtered = stops
        if name:
            filtered = [s for s in filtered if name.lower() in s['name'].lower()]
        if line:
            filtered = [s for s in filtered if s['line'].lower() == line.lower()]
        if not stops:
            return jsonify({"error": "No stops available"}), 503
        return jsonify(filtered), 200

    return app
