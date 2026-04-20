import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function MapView() {
  return (
    <div className="card h-[320px] flex flex-col">
  <h2 className="font-semibold mb-2 text-lg">🗺️ Map</h2>

  <div className="flex-1 rounded-lg overflow-hidden">
    <MapContainer
      center={[20, 78]}
      zoom={3}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[48.8566, 2.3522]} />
    </MapContainer>
  </div>
</div>
  );
}