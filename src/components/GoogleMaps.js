import React, { useState, useEffect, useRef } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { Autocomplete } from '@react-google-maps/api';
import "../styles/GoogleMaps.css";
import Geocoding from './Geocoding';
import RandomLocationGenerator from './RandomLocation';
import UserLocation from './UserLocation';

const MapContainer = ({ google, apiKey }) => {
  const [markers, setMarkers] = useState([]);
  const [mapMounted, setMapMounted] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState({ props: {} });
  const mapRef = useRef(null);

  useEffect(() => {
    setMapMounted(true);
  }, []);

  const onMapClick = (mapProps, map, clickEvent) => {
    const newMarker = {
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng(),
    };
    setMarkers([...markers, newMarker]);
    setLat(newMarker.lat);
    setLng(newMarker.lng);
    setSelectedPlace({});
  };

  const onMarkerClick = (index) => {
    const marker = markers[index];
    setActiveMarker(marker);
    setSelectedPlace({ props: { index } });
    deleteMarker();
  };

  const deleteMarker = () => {
    const updatedMarkers = [...markers];
    const index = updatedMarkers.findIndex((marker) => marker === activeMarker);
    if (index !== -1) {
      updatedMarkers.splice(index, 1);
      setMarkers(updatedMarkers);
      setActiveMarker(null);
    }
  };

  const handleLocationButtonClick = (location, clickEvent) => {
    const newMarker = {
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng(),
    };
    setMarkers([...markers, newMarker]);
    setLat(newMarker.lat);
    setLng(newMarker.lng);
  };

  if (!mapMounted) {
    return "Loading...";
  }

  return (
    <div className="map-wrapper">
      <div className="map-container">
        <Map
          google={google}
          zoom={3}
          initialCenter={{ lat: 39.0902, lng: -95.7129 }}
          containerStyle={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          onClick={onMapClick}
          ref={mapRef}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => onMarkerClick(index)}
              index={index}
            />
          ))}
     
        </Map>
      </div>
      <div className='locationButton'>
        <RandomLocationGenerator onLocationButtonClick={handleLocationButtonClick} />
      </div>
      <div className='locationButton'>
        <UserLocation onLocationButtonClick={handleLocationButtonClick} />
      </div>
      <Geocoding lat={lat} lng={lng} />
    </div>
  );
};

export default GoogleApiWrapper({
apiKey: process.env.REACT_APP_GMAP_KEY
})(MapContainer);
