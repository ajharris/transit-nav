import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

function Home() {
  const [status, setStatus] = useState('');
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('error'));
  }, []);
  return <div>{status || 'home'}</div>;
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
