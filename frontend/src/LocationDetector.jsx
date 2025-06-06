import React, { useEffect } from 'react';

function LocationDetector({ onDetect, onError }) {
  useEffect(() => {
    if (!navigator.geolocation) {
      onError && onError();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (onDetect) {
          onDetect(pos.coords.latitude, pos.coords.longitude);
        }
      },
      () => {
        onError && onError();
      }
    );
  }, [onDetect, onError]);

  return <div>Detecting location...</div>;
}

export default LocationDetector;
