import React, { useState } from 'react';
import { Marker } from '@react-google-maps/api';

const RandomLocationGenerator = ({ map }) => {
  const [randomLocation, setRandomLocation] = useState(null);
  const [marker, setMarker] = useState(null);

  const generateRandomLocation = () => {
    setRandomLocation(null);

    const getUserLocation = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    };

    const getWalkingDistance = (origin, destination) => {
      return new Promise((resolve, reject) => {
        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: 'WALKING',
          },
          (response, status) => {
            if (status === 'OK') {
              const distance = response.rows[0].elements[0].distance.value;
              resolve(distance);
            } else {
              reject(new Error('Failed to get walking distance'));
            }
          }
        );
      });
    };

    const getRandomLat = (userLat) => {
      const min = userLat - 0.0144927536; // 1 mile in latitude degrees
      const max = userLat + 0.0144927536; // 1 mile in latitude degrees
      return Math.random() * (max - min) + min;
    };

    const getRandomLng = (userLat, userLng) => {
      const milesPerLongitudeDegree =
        Math.cos((userLat * Math.PI) / 180) * 69.172; // Approximate miles per longitude degree at the user's latitude
      const min = userLng - 1 / milesPerLongitudeDegree; // 1 mile in longitude degrees
      const max = userLng + 1 / milesPerLongitudeDegree; // 1 mile in longitude degrees
      return Math.random() * (max - min) + min;
    };

    getUserLocation()
      .then((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const lat = getRandomLat(userLat);
        const lng = getRandomLng(userLat, userLng);

        const location = { lat, lng };
        setRandomLocation(location);

        const origin = new window.google.maps.LatLng(userLat, userLng);
        const destination = new window.google.maps.LatLng(lat, lng);

        getWalkingDistance(origin, destination)
          .then((distance) => {
            if (distance > 0) {
              console.log('Walking distance:', distance);
              // Address is on a street within walking distance
            } else {
              console.log('Walking distance is zero');
              // Regenerate a new location
              generateRandomLocation();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
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
