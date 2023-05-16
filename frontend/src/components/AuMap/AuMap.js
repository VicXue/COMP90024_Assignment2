import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import PopupChart from "../TwitterBarChart/PopupChart";

mapboxgl.accessToken = process.env.REACT_APP_MAP_BOX_API_KEY;
function AuMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [lng, setLng] = useState(133.7751);
  const [lat, setLat] = useState(-25.2744);
  const [zoom, setZoom] = useState(2);
  const [geoJSONData, setGeoJSONData] = useState(null);
  const [gccName, setGccName] = useState(null);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API_HOST}:8080/api/v1/geography/gcc`
        );
        const data = await response.json();
        setGeoJSONData(data);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };

    fetchGeoJSON();
  }, []);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    if (!map.current) return;
    else {
      if (!geoJSONData) return;
      map.current.on("load", () => {
        // Add markers
        geoJSONData.data.features.map((feature) => {
          // console.log(feature);
          const marker = new mapboxgl.Marker()
            .setLngLat(feature.geometry.coordinates)
            .addTo(map.current);

          marker.getElement().addEventListener("click", () => {
            setGccName(feature.properties);
          });

          return marker;
        });
      });
    }
  }, [geoJSONData]);

  return (
    <div>
      <div className="au-map-area">
        <div className="au-sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={mapContainer} className="au-map-container" />
      </div>

      {gccName ? (
        <div className="tw-chart-area">
          <PopupChart gccName={gccName.name} />
        </div>
      ) : (
        <div className="tw-text-area">
          <p>Click markers to see relative charts</p>
        </div>
      )}
    </div>
  );
}

export default AuMap;
