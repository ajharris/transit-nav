import React from 'react';

const SUPPORTED_SYSTEMS = [
  { name: 'GO Transit' },
  { name: 'TTC' },
  { name: 'MTA' },
  { name: 'BART' },
];

function TransitSystemSelector({ onSelect }) {
  return (
    <div role="region" aria-label="System selector">
      <h2 id="system-select-label">Select your transit system</h2>
      <ul aria-labelledby="system-select-label">
        {SUPPORTED_SYSTEMS.map(sys => (
          <li key={sys.name}>
            <button onClick={() => onSelect(sys.name)} aria-label={sys.name}>
              {sys.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransitSystemSelector;
