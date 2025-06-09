import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from backend.models import db, Stop, TransitSystem, Line
from backend.scraping import scrape_stops_for_system
from backend.car_placement import CAR_PLACEMENT, normalize_station_name
import os
import requests
from bs4 import BeautifulSoup
from backend.routes import register_routes

def create_app(testing=False):
    static_folder = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend', 'build')
    app = Flask(__name__, static_folder=static_folder, static_url_path='')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///transitnav.db' if not testing else 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    migrate = Migrate(app, db)

    register_routes(app)

    def add_transit_system_with_scrape(name, region=None):
        """
        Add a new TransitSystem to the DB, scrape its lines and stops, and populate the DB.
        """
        # Create the system
        system = TransitSystem(name=name, region=region)
        db.session.add(system)
        db.session.commit()
        # Scrape stops for this system
        stops = scrape_stops_for_system(name)
        # Optionally, infer lines from stops (if available)
        lines_seen = set()
        for stop in stops:
            line_name = stop.get('line', 'Unknown')
            if line_name not in lines_seen:
                line = Line(name=line_name, system_id=system.id)
                db.session.add(line)
                lines_seen.add(line_name)
        db.session.commit()
        # Add stops
        for stop in stops:
            line_obj = Line.query.filter_by(name=stop.get('line', 'Unknown'), system_id=system.id).first()
            db.session.add(Stop(
                name=stop['name'],
                line=stop.get('line', 'Unknown'),
                system=system.name,
                lat=stop.get('lat'),
                lon=stop.get('lon')
            ))
        db.session.commit()
        return system

    app.add_transit_system_with_scrape = add_transit_system_with_scrape

    # Serve React frontend for all non-API routes
    from flask import send_from_directory
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react_app(path):
        if path != '' and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')

    return app

app = create_app()
