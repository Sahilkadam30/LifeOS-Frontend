// src/components/MapView.jsx

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [25, 25],
});

const orangeIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  iconSize: [25, 25],
});

export default function MapView({ visited, wishlist }) {
  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "500px", borderRadius: "10px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {visited.map(v => (
        <Marker key={v.id} position={[v.latitude, v.longitude]} icon={greenIcon}>
          <Popup>{v.placeName}</Popup>
        </Marker>
      ))}

      {wishlist.map(w => (
        <Marker key={w.id} position={[w.latitude, w.longitude]} icon={orangeIcon}>
          <Popup>{w.placeName}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}