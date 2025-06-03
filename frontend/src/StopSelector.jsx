import React, { useEffect, useState } from 'react';

function StopSelector({ system, origin, setOrigin, destination, setDestination }) {
  const [stops, setStops] = useState([]);
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [originListOpen, setOriginListOpen] = useState(false);
  const [destinationListOpen, setDestinationListOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!system) return;
    setLoading(true);
    setError(null);
    // Try to use the system name as a line filter if possible, but fallback to all stops
    const lineParam = encodeURIComponent(system.split(' ')[0]);
    fetch(`/api/stops?line=${lineParam}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stops');
        return res.json();
      })
      .then(data => {
        // If no stops found for line, try fetching all stops
        if (Array.isArray(data) && data.length === 0) {
          return fetch('/api/stops').then(res => res.json());
        }
        return data;
      })
      .then(data => {
        setStops(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setStops([]);
        setError('Could not load stops');
        setLoading(false);
      });
  }, [system]);

  const filterStops = (query) =>
    stops.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      {loading && <div>Loading stops...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <>
          <div>
            <label htmlFor="origin-input">Origin Stop</label>
            <input
              id="origin-input"
              value={originQuery || (origin && origin.name) || ''}
              placeholder="Select origin stop"
              onFocus={() => setOriginListOpen(true)}
              onChange={e => {
                setOriginQuery(e.target.value);
                setOriginListOpen(true);
              }}
              autoComplete="off"
            />
            {originListOpen && (
              <ul style={{ border: '1px solid #ccc', maxHeight: 150, overflowY: 'auto', background: 'white', position: 'absolute', zIndex: 1 }}>
                {filterStops(originQuery).map(stop => (
                  <li key={stop.id}>
                    <button
                      type="button"
                      style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 4 }}
                      onClick={() => {
                        setOrigin(stop);
                        setOriginQuery(stop.name);
                        setOriginListOpen(false);
                      }}
                      disabled={destination && destination.id === stop.id}
                    >
                      {stop.name} {destination && destination.id === stop.id && '(Already selected as destination)'}
                    </button>
                  </li>
                ))}
                {filterStops(originQuery).length === 0 && <li>No stops found</li>}
              </ul>
            )}
          </div>
          <div style={{ marginTop: 32 }}>
            <label htmlFor="destination-input">Destination Stop</label>
            <input
              id="destination-input"
              value={destinationQuery || (destination && destination.name) || ''}
              placeholder="Select destination stop"
              onFocus={() => setDestinationListOpen(true)}
              onChange={e => {
                setDestinationQuery(e.target.value);
                setDestinationListOpen(true);
              }}
              autoComplete="off"
            />
            {destinationListOpen && (
              <ul style={{ border: '1px solid #ccc', maxHeight: 150, overflowY: 'auto', background: 'white', position: 'absolute', zIndex: 1 }}>
                {filterStops(destinationQuery).map(stop => (
                  <li key={stop.id}>
                    <button
                      type="button"
                      style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 4 }}
                      onClick={() => {
                        setDestination(stop);
                        setDestinationQuery(stop.name);
                        setDestinationListOpen(false);
                      }}
                      disabled={origin && origin.id === stop.id}
                    >
                      {stop.name} {origin && origin.id === stop.id && '(Already selected as origin)'}
                    </button>
                  </li>
                ))}
                {filterStops(destinationQuery).length === 0 && <li>No stops found</li>}
              </ul>
            )}
          </div>
          <div style={{ marginTop: 32 }}>
            <strong>Selected:</strong>
            <div>Origin: {origin ? origin.name : <em>None</em>}</div>
            <div>Destination: {destination ? destination.name : <em>None</em>}</div>
          </div>
        </>
      )}
    </div>
  );
}

export default StopSelector;
