import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

// Fix Leaflet marker icons (Vite issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

function HeatLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points?.length) return;

    const heatPoints = points
      .filter(p => p.location?.coordinates)
      .map(p => [p.location.coordinates[1], p.location.coordinates[0], 0.5]);

    const heat = L.heatLayer(heatPoints, { radius: 25 });
    map.addLayer(heat);

    return () => map.removeLayer(heat);
  }, [map, points]);

  return null;
}

export default function IndiaHeatMap() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE || "http://localhost:4000"}/api/cases`)
      .then(res => setCases(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "70vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <HeatLayer points={cases} />

      {cases.map(c => (
        <Marker
          key={c._id}
          position={[c.location.coordinates[1], c.location.coordinates[0]]}
        >
          <Popup>
            <b>{c.disease}</b><br />
            {new Date(c.reportedAt).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

