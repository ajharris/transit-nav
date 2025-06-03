from flask import Flask, send_from_directory
import os

def create_app(testing=False):
    app = Flask(__name__, static_folder='../frontend/build', static_url_path='')

    @app.route('/')
    @app.route('/<path:path>')
    def serve_react(path=''):
        if path:
            normalized_path = os.path.normpath(os.path.join(app.static_folder, path))
            if normalized_path.startswith(app.static_folder) and os.path.exists(normalized_path):
                return send_from_directory(app.static_folder, path)

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

    return app
