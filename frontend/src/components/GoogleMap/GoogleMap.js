import { useEffect, useMemo, useState } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import Geocode from "react-geocode";

import "./GoogleMap.css";

function Home(props) {
  // console.log(props.orders);
  const [placeNameList, setPlaceNameList] = useState([]);

  Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API_KEY);
  Geocode.setRegion("au");

  // const newPlaceNameList = [];
  // useEffect(() => {
  //   for (let i = 0; i < props.orders.length; i++) {
  //     console.log(props.orders[i]);
  //     Geocode.fromAddress(props.orders[i]).then(
  //       (response) => {
  //         const { lat, lng } = response.results[0].geometry.location;
  //         newPlaceNameList.push({ lat, lng });
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     );
  //   }

  //   setPlaceNameList(newPlaceNameList);
  //   console.log(placeNameList);
  // }, [props.orders]);

  useEffect(() => {
    // console.log(props.orders);
    const geocodePromises = props.orders.map((order) =>
      Geocode.fromAddress(order).then((response) => {
        const { lat, lng } = response.results[0].geometry.location;
        // console.log({ lat, lng });
        return { lat, lng };
      })
    );

    Promise.all(geocodePromises).then((newPlaceNameList) =>
      setPlaceNameList(newPlaceNameList)
    );
  }, [props.orders]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return <Map placeNameList={placeNameList} />;
  }
}

function Map({ placeNameList }) {
  const center = useMemo(() => ({ lat: -25.27, lng: 133.78 }), []);

  // const latLngList = [
  //   { lat: -27.47, lng: 153.03 },
  //   { lat: -42.88, lng: 147.33 },
  //   { lat: -33.89, lng: 151.21 },
  //   { lat: -31.95, lng: 115.86 },
  //   { lat: -37.84, lng: 144.95 },
  //   { lat: -33.23, lng: 151.22 },
  //   { lat: -12.46, lng: 130.84 },
  // ];

  // console.log(placeNameList);

  return (
    <div>
      <GoogleMap
        zoom={4.5}
        center={center}
        mapContainerClassName="map-container"
      >
        {/* <MarkerF position={center} /> */}
        {/* {latLngList.map((data, index) => (
          <MarkerF position={data} />
        ))} */}
        {placeNameList.map((data, index) => (
          <MarkerF key={index} position={data} />
        ))}
      </GoogleMap>
    </div>
  );
}

export default Home;
