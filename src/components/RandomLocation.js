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
  }, []);


};

export default RandomLocationApp;