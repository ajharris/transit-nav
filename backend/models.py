from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class TransitSystem(db.Model):
    __tablename__ = 'transit_system'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)
    region = db.Column(db.String(128), nullable=True)
    # Optionally: add more fields as needed

class Line(db.Model):
    __tablename__ = 'line'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    system_id = db.Column(db.Integer, db.ForeignKey('transit_system.id'), nullable=False)
    system = db.relationship('TransitSystem', backref=db.backref('lines', lazy=True))
    # Optionally: add more fields as needed

class Stop(db.Model):
    __tablename__ = 'stop'
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
