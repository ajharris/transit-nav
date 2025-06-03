from flask import Flask, send_from_directory
import os

def create_app(testing=False):
    app = Flask(__name__, static_folder='../client/build', static_url_path='/')

    @app.route('/')
    @app.route('/<path:path>')
    def serve_react(path=''):
        if path:
            normalized_path = os.path.normpath(os.path.join(app.static_folder, path))
            if normalized_path.startswith(app.static_folder) and os.path.exists(normalized_path):
                return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')

    @app.route('/api/health')
    def health_check():
        return {"status": "ok"}

    return app
