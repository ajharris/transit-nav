from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Stop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    line = db.Column(db.String(64), nullable=False)
    system = db.Column(db.String(64), nullable=False)
    lat = db.Column(db.Float, nullable=True)
    lon = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'line': self.line,
            'system': self.system,
            'location': {'lat': self.lat, 'lon': self.lon} if self.lat and self.lon else None
        }
