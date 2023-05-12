import React, { useEffect, useState } from "react";
import "../styles/Geocoding.css"

const Geocoding = ({ lat, lng }) => {
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const getAddressFromLatLong = async () => {
      const apiKey = process.env.REACT_APP_GMAP_KEY;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0) {
          const address = data.results[0].formatted_address;
          setAddress(address);
          console.log(address)
        }
      } catch (error) {
        console.error(error);
      }
    };

    getAddressFromLatLong();
  }, [lat, lng]);

  return (
    <div className="geocoding">
      {address ? (
        <p>Address: {address}</p>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Geocoding;
