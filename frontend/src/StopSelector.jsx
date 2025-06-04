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
    // Always fetch stops for the selected system only
    fetch(`/api/stops?system=${encodeURIComponent(system)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stops');
        return res.json();
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
      {error && <div className="text-danger">{error}</div>}
      {!loading && !error && (
        <>
          <div className="mb-3 position-relative">
            <label htmlFor="origin-input" className="form-label">Origin Stop</label>
            <input
              id="origin-input"
              className="form-control"
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
              <ul className="list-group position-absolute w-100 z-2" style={{ maxHeight: 150, overflowY: 'auto' }}>
                {filterStops(originQuery).map(stop => (
                  <li key={stop.id}>
                    <button
                      type="button"
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setOrigin(stop);
                        setOriginQuery(stop.name);
                        setOriginListOpen(false);
                      }}
                      disabled={destination && destination.id === stop.id}
                    >
                      {stop.name} {destination && destination.id === stop.id && <span className="text-muted">(Already selected as destination)</span>}
                    </button>
                  </li>
                ))}
                {filterStops(originQuery).length === 0 && <li className="list-group-item">No stops found</li>}
              </ul>
            )}
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="destination-input" className="form-label">Destination Stop</label>
            <input
              id="destination-input"
              className="form-control"
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
              <ul className="list-group position-absolute w-100 z-2" style={{ maxHeight: 150, overflowY: 'auto' }}>
                {filterStops(destinationQuery).map(stop => (
                  <li key={stop.id}>
                    <button
                      type="button"
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setDestination(stop);
                        setDestinationQuery(stop.name);
                        setDestinationListOpen(false);
                      }}
                      disabled={origin && origin.id === stop.id}
                    >
                      {stop.name} {origin && origin.id === stop.id && <span className="text-muted">(Already selected as origin)</span>}
                    </button>
                  </li>
                ))}
                {filterStops(destinationQuery).length === 0 && <li className="list-group-item">No stops found</li>}
              </ul>
            )}
          </div>
          <div className="mb-3">
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
