import { useMemo } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

import "./GoogleMap.css";

function Home() {
  const { isLoaded } = useLoadScript({
    // googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: "AIzaSyCtyCZYcCJIVmKi5QxPMFYQGYgOS_RNPrw",
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return <Map />;
  }
}

function Map() {
  const center = useMemo(() => ({ lat: -37.84, lng: 144.95 }), []);

  return (
    <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
      <MarkerF position={center} />
    </GoogleMap>
  );
}

export default Home;
