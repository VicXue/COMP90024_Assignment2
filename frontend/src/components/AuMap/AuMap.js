import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import geoJSON from "../../data/gcc_pt.geojson";

mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9obm55bXUiLCJhIjoiY2xoMGtuNjZhMDdwNjNybndqcmRmc3Y4NCJ9.G5G_PRIPl1394Dg1QBjhpA";

function AuMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [lng, setLng] = useState(133.7751);
  const [lat, setLat] = useState(-25.2744);
  const [zoom, setZoom] = useState(3);
  const [geoJSONData, setGeoJSONData] = useState(null);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(geoJSON);
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
        // console.log(geoJSONData);

        // Clear existing markers
        // markers.forEach((marker) => marker.remove());

        // Add markers
        geoJSONData.features.map((feature) => {
          const marker = new mapboxgl.Marker()
            .setLngLat(feature.geometry.coordinates)
            .addTo(map.current);

          return marker;
        });
      });
    }
  }, [geoJSONData]);

  return (
    <div className="map-area">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default AuMap;
