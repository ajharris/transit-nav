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
    <div className="mb-4" role="region" aria-label="System selector">
      <h2 id="system-select-label" className="h5 mb-2">Select your transit system</h2>
      <div className="position-relative" ref={inputRef}>
        <input
          type="text"
          className="form-control mb-1"
          placeholder="Type or select a system"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setDropdownOpen(true);
          }}
          onFocus={() => setDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Transit system search"
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
            className="list-group position-absolute w-100 z-2"
            style={{ maxHeight: 150, overflowY: 'auto' }}
          >
            {filtered.length > 0 ? (
              filtered.map(sys => (
                <li key={sys.name} role="option">
                  <button
                    type="button"
                    role="button"
                    aria-label={sys.name}
                    className="list-group-item list-group-item-action"
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
              <li role="option">
                <button
                  type="button"
                  role="button"
                  aria-label={query}
                  className="list-group-item list-group-item-action text-muted"
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
