import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { googleMapsApiKey, googlePhotosApiKey } from "./config";

const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};

const getRandomLocation = () => {
  const getRandomLat = () => {
    const min = -90;
    const max = 90;
    return Math.random() * (max - min) + min;
  }

  const getRandomLng = () => {
    const min = -180;
    const max = 180;
    return Math.random() * (max - min) + min;
  }

  const lat = getRandomLat();
  const lng = getRandomLng();

  return { lat, lng };
};

const RandomLocationApp = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [randomLocation, setRandomLocation] = useState(null);

  useEffect(() => {
    getUserLocation()
      .then((location) => {
        setCurrentLocation(location);
      })
      .catch((error) => {
        console.error("Error fetching user location:", error);
      });

    const location = getRandomLocation();
    setRandomLocation(location);
  }, []);

  return (
    <LoadScript googleMapsApiKey={REACT_APP_GMAP_KE}>
      <GoogleMap
        center={currentLocation}
        zoom={12}
        mapContainerStyle={{ width: "100%", height: "400px" }}
      >
        {currentLocation && (
          <Marker position={currentLocation} label="Current Location" />
        )}
        {randomLocation && (
          <Marker position={randomLocation} label="Random Location" />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default RandomLocationApp;
