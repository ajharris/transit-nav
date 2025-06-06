import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LocationDetector from './LocationDetector.jsx';
import TransitSystemSelector from './TransitSystemSelector.jsx';
import StopSelector from './StopSelector.jsx';
import ResultsDisplay from './ResultsDisplay';
import { getRecentTrips, saveTrip } from './recentTrips';

export const SUPPORTED_SYSTEMS = [
  { name: 'GO Transit', region: { lat: 43.65, lon: -79.38, radius: 0.5 } }, // Toronto
  { name: 'TTC', region: { lat: 43.7, lon: -79.4, radius: 0.2 } }, // Example
];

export function getSystemForCoords(lat, lon) {
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
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('error'));
    setRecentTrips(getRecentTrips());
  }, []);

  useEffect(() => {
    if (origin && destination && system) {
      // Fetch optimal car location from backend
      fetch(`/api/best_car?origin=${encodeURIComponent(origin.name)}&destination=${encodeURIComponent(destination.name)}&system=${encodeURIComponent(system)}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => setResult(data))
        .catch(() => setResult(null));
    } else {
      setResult(null);
    }
  }, [origin, destination, system]);

  // Proxy API requests to backend on port 5000
  // Vite config: add this to vite.config.js
  // server: { proxy: { '/api': 'http://localhost:5000' } }

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
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <TransitSystemSelector onSelect={sys => {
            setSystem(sys);
            setOrigin(null);
            setDestination(null);
            setGeoError(null);
            setManual(false);
          }} />
          {system && (
            <>
              <div className="my-3 d-flex align-items-center">
                <span>Detected system: {system}</span>
                <button className="btn btn-outline-secondary btn-sm ms-2" onClick={() => {
                  setSystem(null);
                  setOrigin(null);
                  setDestination(null);
                }}>Change System</button>
              </div>
              <StopSelector
                key={system}
                system={system}
                origin={origin}
                setOrigin={setOrigin}
                destination={destination}
                setDestination={setDestination}
              />
              <button
                className="btn btn-primary w-100 my-3"
                onClick={handleTripConfirm}
                disabled={!origin || !destination}
              >
                Confirm Trip
              </button>
              <ResultsDisplay result={result} />
            </>
          )}
          {geoError && <div className="alert alert-danger mt-3" role="alert">{geoError}</div>}
          <RecentTripsSection recentTrips={recentTrips} onTripClick={trip => {
            setOrigin({ name: trip.start });
            setDestination({ name: trip.destination });
          }} />
          {origin && destination && system && (
            <ResultsDisplay
              origin={origin}
              destination={destination}
              system={system}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function RecentTripsSection({ recentTrips, onTripClick }) {
  if (!recentTrips.length) return <div className="mt-4">No recent trips</div>;
  return (
    <div className="mt-4">
      <strong>Recent Trips</strong>
      <ul className="list-unstyled">
        {recentTrips.map((trip, i) => (
          <li key={i} className="mb-2">
            <button
              className="btn btn-outline-secondary btn-sm w-100 text-start"
              onClick={() => onTripClick(trip)}
            >
              {trip.start} → {trip.destination} <span className="text-muted small">({new Date(trip.timestamp).toLocaleString()})</span>
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
