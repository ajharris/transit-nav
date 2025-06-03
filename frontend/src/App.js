import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LocationDetector from './LocationDetector';
import TransitSystemSelector from './TransitSystemSelector';

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

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('error'));
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

  if (system) return <div>Detected system: {system}</div>;
  if (manual)
    return (
      <div>
        {geoError && <div role="alert">{geoError}</div>}
        <TransitSystemSelector onSelect={setSystem} />
      </div>
    );
  return <LocationDetector onDetect={handleDetect} onError={handleGeoError} />;
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
