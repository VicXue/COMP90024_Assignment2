import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.REACT_APP_MAP_BOX_API_KEY;

function VictoriaMap() {
  const API_URL = process.env.REACT_APP_BACKEND_API_HOST;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const hoveredStateId = useRef(null);
  const popupRef = useRef(null);

  const [lng, setLng] = useState(144.9631);
  const [lat, setLat] = useState(-36.8136);
  const [zoom, setZoom] = useState(5);
  let geoJSONData;

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(API_URL + ":8080/api/v1/geography/lga");
        const data = await response.json();

        delete data.data["_id"];
        delete data.data["_rev"];

        geoJSONData = data.data;
        fillMap();
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };

    fetchGeoJSON();
  }, []);

  const initialiseMap = () => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  };
  useEffect(initialiseMap);

  const fillMap = () => {
    if (!map.current) return;
    else {
      if (!geoJSONData) return;

      //Source
      if (map.current.getSource(`pol`) == null) {
        map.current.addSource(`pol`, {
          type: "geojson",
          data: geoJSONData,
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

      // Pop-Up
      popupRef.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
    }

    map.current.on("mousemove", `pol-fill`, handleMouseMove);
    map.current.on("mouseleave", `pol-fill`, handleMouseLeave);

    return () => {
      map.current.off("mousemove", `pol-fill`, handleMouseMove);
      map.current.off("mouseleave", `pol-fill`, handleMouseLeave);
    };
  };
  // useEffect(fillMap, []);

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

      const prop = e.features[0].properties;
      const coordinates = e.lngLat;

      // Update the popup content
      popupRef.current
        .setLngLat(coordinates)
        .setHTML(
          `<h4>Esitmated percentage of people <br/> with mental health problem <br/> in ${
            prop.LGA_NAME22
          }</h4>
          <h4>Male: ${prop.estmd_nm_1.toFixed(2)}</h4>
          <h4>Female: ${prop.estmd_nmbr.toFixed(2)}</h4>
          <h4>Total: ${prop.estmd_nm_2.toFixed(2)}</h4>`
        )
        .addTo(map.current);
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

    // Remove the popup
    popupRef.current.remove();
  };

  return (
    <div className="vic-map-area">
      <h3 className="vic-h3">
        Esitmated percentage of people with mental health problems <br /> in
        different LGA sections in Victoria
      </h3>
      <div className="vic-sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="vic-map-container" />
    </div>
  );
}

export default VictoriaMap;
