/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { getRequest, baseUrl, postRequest } from "../utils/services";
import { useParams } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";

import "mapbox-gl/dist/mapbox-gl.css";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
// import dotenv from "dotenv";
// dotenv.config();
const Mapbox = () => {
  const { id, type } = useParams();
  const [error, setError] = useState(null);
  const [drawMode, setDrawMode] = useState(false);
  const [alertMsg, setAlertMsg] = useState(false);
  const [fileName, setFileName] = useState(""); // State for custom file name
  const [showSaveForm, setShowSaveForm] = useState(false); // State to control form visibility
  const INITIAL_CENTER = [-74.0242, 40.6941];
  const INITIAL_ZOOM = 10.12;
  const mapContainer = useRef(null);
  const drawRef = useRef(null);
  const mapRef = useRef(null);

  const updateShapes = (e) => {
    const shapes = drawRef.current.getAll();
    console.log("Shapes data:", shapes);
  };

  const draw = new MapboxDraw({
    // Initialize Mapbox Draw with custom controls
    displayControlsDefault: false,
    controls: {
      polygon: true,
      line_string: true,
      point: true,
      trash: true,
    },
  });

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2F5Y3R5IiwiYSI6ImNtMzZwcWx4bjA2azUya3J4cnI0dmowcmoifQ.qLhx61CN8I3wPK2kGMaHmw";

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl());

    const fetchFiles = async (fileId) => {
      // Fetch and display a GeoJSON file based on the provided ID and type

      try {
        const response = await getRequest(`${baseUrl}/upload/${fileId}`, {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("User")).token
          }`,
        });
        map.on("load", () => {
          map.addSource("geojson-data", {
            type: type,
            data: response,
          });

          map.addLayer({
            id: "geojson-layer",
            type: "fill",
            source: "geojson-data",
            layout: {},
            paint: {
              "fill-color": "#888",
              "fill-opacity": 0.5,
            },
          });
        });
      } catch (error) {
        setError(error.message);
      }
    };

    if (id && type) {
      // Fetch file if ID and type are available in URL
      fetchFiles(id);
    }

    drawRef.current = draw; // Save the draw instance and Add Mapbox Draw controls to the map
    map.addControl(draw);

    map.on("draw.create", updateShapes);
    map.on("draw.update", updateShapes);
    map.on("draw.delete", updateShapes);

    const popup = new mapboxgl.Popup({
      // Initialize popup for displaying descriptions on hover

      closeButton: false,
      closeOnClick: false,
    });

    map.on("mouseenter", "geojson-layer", (e) => {
      map.getCanvas().style.cursor = "pointer";

      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e
        ? e?.features[0]?.properties?.description
        : "Test popup";

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on("mouseleave", "geojson-layer", () => {
      // Remove popup on mouse leave

      map.getCanvas().style.cursor = "";
      popup.remove();
    });

    map.on("draw.create", (e) => {
      // Event listeners for marker create, update, and delete.
      if (e.features[0].geometry.type === "Point") {
        const markerData = {
          id: e.features[0].id,
          coordinates: e.features[0].geometry.coordinates,
        };
        // Save or update markerData in your backend or state
        console.log("Marker created:", markerData);
      }
    });

    map.on("draw.update", (e) => {
      if (e.features[0].geometry.type === "Point") {
        const updatedMarkerData = {
          id: e.features[0].id,
          coordinates: e.features[0].geometry.coordinates,
        };
        // Update markerData in your backend or state
        console.log("Marker updated:", updatedMarkerData);
      }
    });

    map.on("draw.delete", (e) => {
      if (e.features[0].geometry.type === "Point") {
        const deletedMarkerId = e.features[0].id;
        // Delete markerData from your backend or state
        console.log("Marker deleted:", deletedMarkerId);
      }
    });

    map.on("draw.create", (e) => {
      // Calculate distance when drawing a line
      if (e.features[0].geometry.type === "LineString") {
        const length = turf.length(e.features[0], { units: "kilometers" });
        setAlertMsg(`Distance: ${length.toFixed(2)} km`);
      }
    });

    return () => map.remove();
  }, [id, type]);

  const toggleDrawMode = () => {
    // Toggle drawing mode between polygon and select mode
    setDrawMode((prevMode) => {
      if (prevMode) {
        drawRef.current.changeMode("simple_select");
      } else {
        drawRef.current.changeMode("draw_polygon");
      }
      return !prevMode;
    });
  };

  /**
   * Saves the current map state and drawn shapes to the server as a GeoJSON file.
   *
   * The function retrieves all drawn shapes from the map using the Mapbox Draw controls
   * and captures the current state of the map (center and zoom level). It then sends a
   * POST request to the server to save this data, including a custom file name or a default
   * name with a timestamp. The user's authentication token is included in the request headers.
   *
   * If the saving process is successful, an alert message is shown and the file name input is
   * cleared. If an error occurs during the saving process, an error message is set.
   */
  const handleSave = async () => {
    const shapesData = drawRef.current.getAll(); // Retrieve all drawn shapes as GeoJSON
    const map = mapRef.current; // Get the map instance
    const mapState = {
      center: map.getCenter(),
      zoom: map.getZoom(),
    };

    try {
      const token = JSON.parse(localStorage.getItem("User")).token;
      const response = await postRequest(
        `/upload/create`,
        {
          name: fileName || `Map_Snapshot_${Date.now()}`, // Using customize name for save file
          //   content: shapesData,
          content: {
            geojson: shapesData,
            mapState,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.error) {
        setError(response.message);
      } else {
        alert("Map data saved successfully!");
        setFileName("");
      }
    } catch (error) {
      setError("Error saving map data");
    }
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {alertMsg && <Alert variant="info">{alertMsg}</Alert>}
      <Button
        variant="primary"
        style={{ marginBottom: "1rem", marginRight: "0.5rem" }}
        onClick={toggleDrawMode}
      >
        {drawMode ? "Exit Draw Mode" : "Draw"}
      </Button>
      {showSaveForm ? (
        <div
          style={{
            marginBottom: "1rem",
            width: "20%",
            height: "30px",
            display: "flex",
          }}
        >
          <Form.Control
            type="text"
            placeholder="Enter file name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <Button
            variant="success"
            onClick={handleSave}
            style={{ marginRight: "0.5rem" }}
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          variant="primary"
          onClick={() => setShowSaveForm(true)}
          style={{ marginBottom: "1rem" }}
        >
          Save
        </Button>
      )}

      <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />
    </div>
  );
};
export default Mapbox;
