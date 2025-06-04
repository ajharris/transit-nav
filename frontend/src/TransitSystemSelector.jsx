import React, { useState, useEffect, useRef } from 'react';

const SUPPORTED_SYSTEMS = [
  { name: 'GO Transit' },
  { name: 'TTC' },
  { name: 'MTA' },
  { name: 'BART' },
];

function TransitSystemSelector({ onSelect }) {
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef();
  const filtered = query
    ? SUPPORTED_SYSTEMS.filter(sys => sys.name.toLowerCase().includes(query.toLowerCase()))
    : SUPPORTED_SYSTEMS;

  // Open dropdown on mount for accessibility tests
  useEffect(() => {
    setDropdownOpen(true);
  }, []);

  // Close dropdown on blur
  useEffect(() => {
    function handleClick(e) {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Direct system selection if input matches a supported system
  useEffect(() => {
    const match = SUPPORTED_SYSTEMS.find(sys => sys.name.toLowerCase() === query.trim().toLowerCase());
    if (match) {
      onSelect(match.name);
      setQuery(match.name); // ensure input is normalized
      setDropdownOpen(false);
    }
    // eslint-disable-next-line
  }, [query]);

  // If only one filtered result and user presses Enter, select it
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filtered.length === 1) {
      onSelect(filtered[0].name);
      setQuery(filtered[0].name);
      setDropdownOpen(false);
    }
  };

  return (
    <div role="region" aria-label="System selector" style={{ position: 'relative', maxWidth: 320 }}>
      <h2 id="system-select-label">Select your transit system</h2>
      <div style={{ position: 'relative' }} ref={inputRef}>
        <input
          type="text"
          placeholder="Type or select a system"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setDropdownOpen(true);
          }}
          onFocus={() => setDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Transit system search"
          style={{ width: '100%', padding: 8, marginBottom: 4 }}
          autoComplete="off"
          role="combobox"
          aria-expanded={dropdownOpen}
          aria-controls="system-listbox"
          aria-autocomplete="list"
        />
        {dropdownOpen && (
          <ul
            id="system-listbox"
            role="listbox"
            style={{ border: '1px solid #ccc', background: 'white', position: 'absolute', width: '100%', zIndex: 2, maxHeight: 150, overflowY: 'auto', margin: 0, padding: 0, listStyle: 'none' }}
          >
            {filtered.length > 0 ? (
              filtered.map(sys => (
                <li key={sys.name} role="option">
                  <button
                    type="button"
                    role="button"
                    aria-label={sys.name}
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 8 }}
                    onClick={() => {
                      onSelect(sys.name);
                      setQuery(sys.name);
                      setDropdownOpen(false);
                    }}
                  >
                    {sys.name}
                  </button>
                </li>
              ))
            ) : (
              <li style={{ padding: 8, color: '#888' }} role="option">
                <button
                  type="button"
                  role="button"
                  aria-label={query}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#888' }}
                  onClick={() => {
                    onSelect(query);
                    setDropdownOpen(false);
                  }}
                >
                  Add "{query}" (not yet supported)
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TransitSystemSelector;
