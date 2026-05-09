import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMapEvents,
  LayersControl,
  useMap,
} from "react-leaflet";

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

import { useEffect, useState } from "react";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

const greenIcon = new L.Icon({
  iconUrl:
    "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [30, 30],
});

const orangeIcon = new L.Icon({
  iconUrl:
    "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  iconSize: [30, 30],
});

const clickIcon = new L.Icon({
  iconUrl:
    "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [35, 35],
});

// ✅ FIX MAP SIZE
function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);

  return null;
}

// ✅ CURRENT LOCATION
function CurrentLocation() {

  const map = useMap();

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(
      (position) => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        map.flyTo([lat, lng], 10);

      },
      (err) => {
        console.log(err);
      }
    );

  }, [map]);

  return null;
}

function SearchField({
  setCoordinates,
  setClickedPosition,
}) {

  const map = useMap();

  useEffect(() => {

    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,

      style: "bar",

      showMarker: false,
      showPopup: false,

      autoClose: true,
      retainZoomLevel: false,

      animateZoom: true,

      searchLabel: "Search place...",

      keepResult: true,
    });

    map.addControl(searchControl);

    // ✅ SEARCH EVENT
    map.on("geosearch/showlocation", async (result) => {

      const lat = result.location.y;
      const lng = result.location.x;

      // TEMP MARKER
      setClickedPosition([lat, lng]);

      try {

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = await response.json();

        const placeName =
          data.name ||
          data.address?.tourism ||
          data.address?.road ||
          data.display_name?.split(",")[0] ||
          "";

        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.state ||
          "";

        // ✅ AUTO FILL
        setCoordinates({
          latitude: lat,
          longitude: lng,
          placeName,
          city,
        });

      } catch (err) {
        console.log(err);
      }
    });

    return () => map.removeControl(searchControl);

  }, [map]);

  return null;
}

// 📍 CLICK EVENT
function LocationMarker({
  setCoordinates,
  clickedPosition,
  setClickedPosition,
}) {

  useMapEvents({

    async click(e) {

      const { lat, lng } = e.latlng;

      // ✅ TEMP MARKER
      setClickedPosition([lat, lng]);

      try {

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = await response.json();

        const placeName =
          data.name ||
          data.address?.tourism ||
          data.address?.road ||
          data.display_name?.split(",")[0] ||
          "";

        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.state ||
          "";

        setCoordinates({
          latitude: lat,
          longitude: lng,
          placeName,
          city,
        });

      } catch (err) {
        console.log(err);
      }
    },
  });

  return null;
}

export default function MapView({
  visited,
  wishlist,
  setCoordinates,
}) {

  const [clickedPosition, setClickedPosition] =
    useState(null);

  return (
    <div className="map-wrapper">

      {/* LEGEND */}
      <div className="map-legend">

        <div className="legend-item">
          <span className="legend-dot green-dot"></span>
          <p>Visited Places</p>
        </div>

        <div className="legend-item">
          <span className="legend-dot orange-dot"></span>
          <p>Want To Visit</p>
        </div>

      </div>

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

        <ResizeMap />

        <CurrentLocation />

        {/* ✅ SEARCH PLACE */}
  {setCoordinates && (

    <SearchField
      setCoordinates={setCoordinates}
      setClickedPosition={setClickedPosition}
    />

  )}

        {/* MAP LAYERS */}
        <LayersControl position="topright">

          {/* NORMAL MAP */}
          <LayersControl.BaseLayer checked name="Street Map">

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

          </LayersControl.BaseLayer>

          {/* SATELLITE */}
          <LayersControl.BaseLayer name="Satellite">

            <TileLayer
              attribution='&copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

          </LayersControl.BaseLayer>

        </LayersControl>

        {/* CLICK EVENT */}
        {setCoordinates && (

          <LocationMarker
            setCoordinates={setCoordinates}
            clickedPosition={clickedPosition}
            setClickedPosition={setClickedPosition}
          />

        )}

        {/* TEMP CLICK MARKER */}
        {clickedPosition && (

          <Marker
            position={clickedPosition}
            icon={clickIcon}
          >
            <Popup>
              Selected Location
            </Popup>
          </Marker>

        )}

        {/* VISITED */}
        {visited?.map((v) => (

          <Marker
            key={v.id}
            position={[v.latitude, v.longitude]}
            icon={greenIcon}
          >

            <Tooltip
              direction="top"
              offset={[0, -20]}
              opacity={1}
            >
              {v.placeName}
            </Tooltip>

            <Popup>
              <b>{v.placeName}</b>
              <br />
              {v.city}
            </Popup>

          </Marker>

        ))}

        {/* WISHLIST */}
        {wishlist?.map((w) => (

          <Marker
            key={w.id}
            position={[w.latitude, w.longitude]}
            icon={orangeIcon}
          >

            <Tooltip
              direction="top"
              offset={[0, -20]}
              opacity={1}
            >
              {w.placeName}
            </Tooltip>

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