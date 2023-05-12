import React, { useState } from 'react';
import { Marker } from '@react-google-maps/api';

const RandomLocationGenerator = ({ map }) => {
  const [randomLocation, setRandomLocation] = useState(null);
  const [marker, setMarker] = useState(null);

  const generateRandomLocation = () => {
    const getRandomLat = () => {
      const min = -90;
      const max = 90;
      return Math.random() * (max - min) + min;
    };

    const getRandomLng = () => {
      const min = -180;
      const max = 180;
      return Math.random() * (max - min) + min;
    };

    const lat = getRandomLat();
    const lng = getRandomLng();

    const location = { lat, lng };
    setRandomLocation(location);

    if (map) {
      // Remove the previous marker if it exists
      if (marker) {
        marker.setMap(null);
      }

      // Create a new marker and add it to the map
      const newMarker = new window.google.maps.Marker({
        position: location,
        map,
      });
      setMarker(newMarker);
    }
  };

  return (
    <div>
      <button onClick={generateRandomLocation}>Generate Random Location</button>
      {randomLocation && (
        <p>
          Random Location: {randomLocation.lat}, {randomLocation.lng}
        </p>
      )}
    </div>
  );
};


export default RandomLocationGenerator;
