import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const MapComponent = ({ location }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      center={location}
      zoom={15}
      mapContainerStyle={{ width: "100%", height: "400px" }}
    >
      <Marker position={location} />
    </GoogleMap>
  );
};

export default MapComponent;
