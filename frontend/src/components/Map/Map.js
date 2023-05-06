import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import geoJSON from "../../data/lga_copy.geojson";

mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9obm55bXUiLCJhIjoiY2xoMGtuNjZhMDdwNjNybndqcmRmc3Y4NCJ9.G5G_PRIPl1394Dg1QBjhpA";

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const hoveredStateId = useRef(null);

  const [lng, setLng] = useState(144.9631);
  const [lat, setLat] = useState(-36.8136);
  const [zoom, setZoom] = useState(6);

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
    if (!map.current) return;
    else {
      if (!geoJSON) return;

      map.current.on("load", () => {
        //Source
        if (map.current.getSource(`pol`) == null) {
          map.current.addSource(`pol`, {
            type: "geojson",
            data: geoJSON,
            // data: geoData,
          });
        }

        // Fill
        if (map.current.getLayer(`pol-fill`) == null) {
          map.current.addLayer({
            id: `pol-fill`,
            type: "fill",
            source: `pol`, // reference the data source
            layout: {},
            paint: {
              "fill-color": "#FF3C00",
              // "fill-opacity": 0.35,
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.7,
                0.35,
              ],
            },
          });
        }

        // Outline
        if (map.current.getLayer("pol-outline") == null) {
          map.current.addLayer({
            id: "pol-outline",
            type: "line",
            source: `pol`,
            layout: {},
            paint: {
              "line-color": "#000000",
              "line-width": 0.8,
            },
          });
        }

        // Set initial feature state
        map.current.setFeatureState(
          { source: "pol", id: hoveredStateId.current },
          { hover: false }
        );
      });
    }

    map.current.on("mousemove", `pol-fill`, handleMouseMove);
    map.current.on("mouseleave", `pol-fill`, handleMouseLeave);

    return () => {
      map.current.off("mousemove", `pol-fill`, handleMouseMove);
      map.current.off("mouseleave", `pol-fill`, handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const handleMouseMove = (e) => {
    if (e.features.length > 0) {
      // console.log(e.features[0]);
      // console.log(hoveredFeature);
      // console.log(hoveredStateId.current);

      // hoveredStateId.current = e.features[0].properties["LGA_CODE22"];

      // console.log(hoveredStateId.current);

      if (hoveredStateId.current !== null) {
        map.current.setFeatureState(
          { source: `pol`, id: hoveredStateId.current },
          { hover: false }
        );
      }

      hoveredStateId.current = e.features[0].id;
      if (hoveredStateId.current !== undefined) {
        hoveredStateId.current = e.features[0].id;

        map.current.setFeatureState(
          { source: `pol`, id: hoveredStateId.current },
          { hover: true }
        );
      }
    }
  };

  const handleMouseLeave = () => {
    if (hoveredStateId.current !== null) {
      map.current.setFeatureState(
        { source: "pol", id: hoveredStateId.current },
        { hover: false }
      );
    }
    hoveredStateId.current = null;
  };

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default Map;
