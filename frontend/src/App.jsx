import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LocationDetector from './LocationDetector.jsx';
import TransitSystemSelector from './TransitSystemSelector.jsx';
import StopSelector from './StopSelector.jsx';
import { getRecentTrips, saveTrip } from './recentTrips';

const SUPPORTED_SYSTEMS = [
  { name: 'GO Transit', region: { lat: 43.65, lon: -79.38, radius: 0.5 } }, // Toronto
  { name: 'TTC', region: { lat: 43.7, lon: -79.4, radius: 0.2 } }, // Example
];

function getSystemForCoords(lat, lon) {
  for (const sys of SUPPORTED_SYSTEMS) {
    const d = Math.sqrt(
      Math.pow(lat - sys.region.lat, 2) + Math.pow(lon - sys.region.lon, 2)
    );
    if (d < sys.region.radius) return sys.name;
  }
  return null;
}

function Home() {
  const [status, setStatus] = useState('');
  const [system, setSystem] = useState(null);
  const [manual, setManual] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('error'));
    setRecentTrips(getRecentTrips());
  }, []);

  const handleDetect = ({ latitude, longitude }) => {
    const sys = getSystemForCoords(latitude, longitude);
    if (sys) setSystem(sys);
    else setManual(true);
  };
  const handleGeoError = (msg) => {
    setGeoError(msg);
    setManual(true);
  };

  // Save trip to localStorage and update recent trips state
  const handleTripConfirm = () => {
    if (origin && destination) {
      const trip = {
        start: origin.name,
        destination: destination.name,
        timestamp: Date.now(),
      };
      saveTrip(trip);
      setRecentTrips(getRecentTrips());
    }
  };

  return (
    <div>
      <TransitSystemSelector onSelect={sys => {
        setSystem(sys);
        setOrigin(null);
        setDestination(null);
        setGeoError(null);
        setManual(false);
      }} />
      {system && (
        <>
          <div>Detected system: {system} <button style={{marginLeft:8}} onClick={() => {
            setSystem(null);
            setOrigin(null);
            setDestination(null);
          }}>Change System</button></div>
          <StopSelector
            system={system}
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
          />
          <button
            onClick={handleTripConfirm}
            disabled={!origin || !destination}
            style={{ marginTop: 16 }}
          >
            Confirm Trip
          </button>
        </>
      )}
      {geoError && <div role="alert">{geoError}</div>}
      <RecentTripsSection recentTrips={recentTrips} onTripClick={trip => {
        setOrigin({ name: trip.start });
        setDestination({ name: trip.destination });
      }} />
    </div>
  );
}

function RecentTripsSection({ recentTrips, onTripClick }) {
  if (!recentTrips.length) return <div style={{ marginTop: 32 }}>No recent trips</div>;
  return (
    <div style={{ marginTop: 32 }}>
      <strong>Recent Trips</strong>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {recentTrips.map((trip, i) => (
          <li key={i}>
            <button
              style={{ background: 'none', border: '1px solid #ccc', margin: 2, padding: 6, borderRadius: 4 }}
              onClick={() => onTripClick(trip)}
            >
              {trip.start} → {trip.destination} <span style={{ color: '#888', fontSize: 12 }}>({new Date(trip.timestamp).toLocaleString()})</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotFound() {
  return <div>not found</div>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
