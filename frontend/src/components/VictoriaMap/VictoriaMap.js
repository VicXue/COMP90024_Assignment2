import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import geoJSON from "../../data/lga_copy.geojson";

// mapboxgl.accessToken = process.env.REACT_APP_MAP_BOX_TOKEN;
mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9obm55bXUiLCJhIjoiY2xoMGtuNjZhMDdwNjNybndqcmRmc3Y4NCJ9.G5G_PRIPl1394Dg1QBjhpA";

function VictoriaMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const hoveredStateId = useRef(null);
  const popupRef = useRef(null);

  const [lng, setLng] = useState(144.9631);
  const [lat, setLat] = useState(-36.8136);
  const [zoom, setZoom] = useState(6);
  const [geoJSONData, setGeoJSONData] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(geoJSON);
  //       const jsonData = await response.json();
  //       console.log(jsonData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const fetchGeoJSON = async () => {
  //     try {
  //       const response = await fetch(
  //         // `${process.env.REACT_APP_BACKEND_API_HOST}:8080/api/v1/geography/lga`
  //         `http://172.26.134.155:8080/api/v1/geography/lga`
  //       );
  //       const data = await response.json();

  //       delete data.data["_id"];
  //       delete data.data["_rev"];
  //       // console.log(data.data);

  //       setGeoJSONData(data.data);
  //     } catch (error) {
  //       console.error("Error fetching GeoJSON data:", error);
  //     }
  //   };

  //   fetchGeoJSON();
  // }, []);

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

      // console.log(geoJSONData);
      map.current.on("load", () => {
        //Source
        if (map.current.getSource(`pol`) == null) {
          map.current.addSource(`pol`, {
            type: "geojson",
            data: geoJSON,
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

      const prop = e.features[0].properties;
      // console.log(prop);
      const coordinates = e.lngLat;

      // Update the popup content
      popupRef.current
        .setLngLat(coordinates)
        .setHTML(
          `<h4>${prop.LGA_NAME22}</h4><h4>1: ${prop.estmd_nm_1}</h4><h4>2: ${prop.estmd_nm_2}</h4><h4>3: ${prop.estmd_nmbr}</h4>`
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
    <div className="map-area">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default VictoriaMap;
