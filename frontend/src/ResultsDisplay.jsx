import React from 'react';

function ResultsDisplay({ result }) {
  if (!result) return <div data-testid="results-empty">No result available</div>;
  return (
    <div data-testid="results-display" style={{ marginTop: 32, border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
      <strong>Optimal Car Location</strong>
      <div style={{ marginTop: 8 }}>
        <span>Recommended Car: <b>{Array.isArray(result.car) ? result.car.join(' or ') : result.car}</b></span>
      </div>
      {result.notes && <div style={{ marginTop: 8 }}>{result.notes}</div>}
      {result.explanation && <div style={{ marginTop: 8, color: '#555' }}>{result.explanation}</div>}
    </div>
  );
}

export default ResultsDisplay;
