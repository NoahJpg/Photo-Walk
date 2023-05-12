import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { Autocomplete } from '@react-google-maps/api';
import "../styles/GoogleMaps.css"
import RandomLocationGenerator from './RandomLocation';
import Geocoding from './Geocoding';

class MapContainer extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      mapMounted: false,
      lat: null,
      lng: null,
      address: null,
      activeMarker: null,
      previousMarker: null,
      selectedPlace: { props: {} },
      isMarkerClicked: false,
      place: null,
    };
    this.mapRef = React.createRef();

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.setState({ mapMounted: true})
  }

  handleClick = () => {
    this.setState({ fadeOut: true });
  }

  onMapClick = (mapProps, map, clickEvent) => {
    const newMarker = {
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng(),
    };
    this.setState({ 
      markers: [...this.state.markers, newMarker], 
      lat: newMarker.lat, 
      lng: newMarker.lng,
      isMarkerClicked: true,
      selectedPlace: {}
    });

    // this.getAddressFromLatLong(newMarker.lat, newMarker.lng);
    
  };

  onMarkerClick = (index) => {
    const marker = this.state.markers[index];
    this.setState({
      activeMarker: marker,
      selectedPlace: { props: { index}},
    });
    this.deleteMarker();

  
  }
 
  deleteMarker = () => {
    const markers = [...this.state.markers];
    const index = markers.findIndex((marker) => marker === this.state.activeMarker);
    if (index !== -1 ) {
      markers.splice(index, 1);
      this.setState({
        markers: markers,
        activeMarker: null,
      });
    }
  }

  onPlaceChanged = (autocomplete) => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const { lat, lng } = place.geometry.location;
      const newMarker = {
        lat: lat(),
        lng: lng(),
      };
      const address = place.formatted_address;

      const map = this.mapRef.current.map;
      const marker = new this.props.google.maps.Marker({
        map,
        position: newMarker,
      });
      map.setCenter(newMarker);
      map.setZoom(12);

      this.setState({
        markers: [newMarker],
        lat: newMarker.lat,
        lng: newMarker.lng,
        address,
        place,
        selectedPlace: { props: { index: 0 } },
        isMarkerClicked: true,
      });
    } else {
      console.log('Autocomplete returned null.');
    }
  };

  
  render() {
    const { google } = this.props;
    const { markers, mapMounted, lat, lng } = this.state;

    if (!mapMounted) {
      return "Loading...";
    }

    return (
      <div className="map-wrapper">
        <div className="map-container">
          <Map
            google={google}
            zoom={4}
            initialCenter={{ lat: 37.0902, lng: -95.7129 }}
            containerStyle={{
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
            onClick={this.onMapClick}
            ref={this.mapRef}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => this.onMarkerClick(index)}
                index={index}
              />
            ))}
            <RandomLocationGenerator map={this.mapRef.current} />
          </Map>
        </div>
        <Geocoding lat={lat} lng={lng} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GMAP_KEY
})(MapContainer);
