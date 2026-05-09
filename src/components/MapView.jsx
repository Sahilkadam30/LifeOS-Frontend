import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";

const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [30, 30],
});

const orangeIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  iconSize: [30, 30],
});

// ✅ Fix blank map rendering
function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);

  return null;
}

// 📍 Click map
function LocationMarker({ setCoordinates }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setCoordinates({
        latitude: lat,
        longitude: lng,
      });
    },
  });

  return null;
}

export default function MapView({
  visited,
  wishlist,
  setCoordinates,
}) {
  return (
    <div className="map-wrapper">
      <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          scrollWheelZoom={true}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "20px",
          }}
        >
        {/* ✅ IMPORTANT */}
        <ResizeMap />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Click event */}
        {setCoordinates && (
          <LocationMarker setCoordinates={setCoordinates} />
        )}

        {/* Visited */}
        {visited?.map((v) => (
          <Marker
            key={v.id}
            position={[v.latitude, v.longitude]}
            icon={greenIcon}
          >
            <Popup>
              <b>{v.placeName}</b>
              <br />
              {v.city}
            </Popup>
          </Marker>
        ))}

        {/* Wishlist */}
        {wishlist?.map((w) => (
          <Marker
            key={w.id}
            position={[w.latitude, w.longitude]}
            icon={orangeIcon}
          >
            <Popup>
              <b>{w.placeName}</b>
              <br />
              {w.city}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}