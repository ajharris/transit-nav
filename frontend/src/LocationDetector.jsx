import React, { useEffect } from 'react';

function LocationDetector({ onDetect, onError }) {
  useEffect(() => {
    if (!navigator.geolocation) {
      onError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        onDetect({ latitude, longitude });
      },
      err => {
        onError(err.message || 'Geolocation error');
      }
    );
  }, [onDetect, onError]);

  return <div>Detecting location...</div>;
}

export default LocationDetector;
