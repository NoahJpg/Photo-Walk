import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { Autocomplete } from '@react-google-maps/api';
import "../styles/GoogleMaps.css"

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

  handleGeolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const newMarker = {
            lat: lat,
            lng: lng,
          };
          this.setState({
            markers: [newMarker],
            lat: lat,
            lng: lng,
            isMarkerClicked: true,
            selectedPlace: {},
          });
          this.getAddressFromLatLong(lat, lng);
        },
        () => {
          alert('Could not get your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
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

    this.getAddressFromLatLong(newMarker.lat, newMarker.lng);
    
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

  getAddressFromLatLong = async (lat, lng) => {
    const apiKey = process.env.REACT_APP_GMAP_KEY
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const address = data.results[0].formatted_address;
        this.setState({ address }, () => {});
      }
    } catch (error) {
      console.error(error);
    }
  };

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
    const { markers, mapMounted } = this.state;

    if (!mapMounted) {
      return "Loading...";
    }

    return (
      <div className='map-wrapper'>
        <Map
          google={google}
          zoom={4}
          initialCenter={{ lat: 37.0902, lng: -95.7129 }}
          mapContainerClassName="map-container"
          onClick={this.onMapClick}
          ref={this.mapRef}>
            
          {markers.map((marker, index) => (
            <Marker 
              key={index} 
              position={{lat: marker.lat, lng: marker.lng}} 
              onClick={() => this.onMarkerClick(index)}
              index={index}>          
            </Marker>
          ))}
          <div className='autocompleteContainer'>
            <Autocomplete
              onLoad={(autocomplete) => this.autocomplete = autocomplete}
              onPlaceChanged={() => this.onPlaceChanged(this.autocomplete)}
            >
              <input
                type="text"
                placeholder="Enter an address"
                className="search-input"
              />
            </Autocomplete>
          </div>
        </Map>

       </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GMAP_KEY
})(MapContainer);
