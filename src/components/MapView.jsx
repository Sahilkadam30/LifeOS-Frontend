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

import {
  GeoSearchControl,
  OpenStreetMapProvider,
} from "leaflet-geosearch";

import { useEffect, useState } from "react";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

// ================= ICONS =================

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

// ================= SECTION ICON =================

function createSectionIcon(color) {

  return new L.DivIcon({
    className: "",

    html: `
      <div style="
        background:${color};
        width:18px;
        height:18px;
        border-radius:50%;
        border:3px solid white;
        box-shadow:0 2px 10px rgba(0,0,0,0.25);
      "></div>
    `,

    iconSize: [18, 18],
  });
}

// ================= FIX MAP SIZE =================

function ResizeMap() {

  const map = useMap();

  useEffect(() => {

    const timer = setTimeout(() => {

      if (map) {
        map.invalidateSize();
      }

    }, 300);

    return () => clearTimeout(timer);

  }, [map]);

  return null;
}

// ================= CURRENT LOCATION =================

function CurrentLocation() {

  const map = useMap();

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const lat =
          position.coords.latitude;

        const lng =
          position.coords.longitude;

        map.flyTo([lat, lng], 10);

      },

      (err) => {
        console.log(err);
      }
    );

  }, [map]);

  return null;
}

// ================= SEARCH =================

function SearchField({
  setCoordinates,
  setClickedPosition,
  setPlaces,
}) {

  const map = useMap();

  useEffect(() => {

    const provider =
      new OpenStreetMapProvider();

    const searchControl =
      new GeoSearchControl({

        provider,

        style: "bar",

        showMarker: false,

        showPopup: false,

        autoClose: true,

        retainZoomLevel: false,

        animateZoom: true,

        searchLabel:
          "Search destinations...",

        keepResult: true,
      });

    map.addControl(searchControl);

    // ================= SEARCH EVENT =================

    map.on(
      "geosearch/showlocation",

      async (result) => {

        const lat =
          result.location.y;

        const lng =
          result.location.x;

        setClickedPosition([
          lat,
          lng,
        ]);

        try {

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );

          const data =
            await response.json();

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

          // ================= VISITED/WISHLIST =================

          if (setCoordinates) {

            setCoordinates({
              latitude: lat,
              longitude: lng,
              placeName,
              city,
            });

          }

          // ================= CREATE SECTION =================

          if (setPlaces) {

            setPlaces((prev) => {

              const alreadyExists =
                prev.some(
                  (p) =>
                    Number(p.latitude).toFixed(4) ===
                      Number(lat).toFixed(4) &&
                    Number(p.longitude).toFixed(4) ===
                      Number(lng).toFixed(4)
                );

              if (alreadyExists) {
                return prev;
              }

              return [
                ...prev,
                {
                  placeName,
                  stateName: city,
                  latitude: lat,
                  longitude: lng,
                  visited: false,
                },
              ];

            });

          }

        } catch (err) {
          console.log(err);
        }
      }
    );

    return () => {

      map.removeControl(searchControl);

    };

  }, [map]);

  return null;
}

// ================= CLICK EVENT =================

function LocationMarker({
  setCoordinates,
  setClickedPosition,
  setPlaces,
}) {

  useMapEvents({

    async click(e) {

      const { lat, lng } =
        e.latlng;

      setClickedPosition([
        lat,
        lng,
      ]);

      try {

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data =
          await response.json();

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

        // ================= VISITED/WISHLIST =================

        if (setCoordinates) {

          setCoordinates({
            latitude: lat,
            longitude: lng,
            placeName,
            city,
          });

        }

        // ================= CREATE SECTION =================

        if (setPlaces) {

          setPlaces((prev) => {

            const alreadyExists =
              prev.some(
                (p) =>
                  Number(p.latitude).toFixed(4) ===
                    Number(lat).toFixed(4) &&
                  Number(p.longitude).toFixed(4) ===
                    Number(lng).toFixed(4)
              );

            if (alreadyExists) {
              return prev;
            }

            return [
              ...prev,
              {
                placeName,
                stateName: city,
                latitude: lat,
                longitude: lng,
                visited: false,
              },
            ];

          });

        }

      } catch (err) {
        console.log(err);
      }
    },
  });

  return null;
}

// ================= MAIN COMPONENT =================

export default function MapView({
  visited = [],
  wishlist = [],
  sections = [],
  setCoordinates,
  setPlaces,
  selectedColor,
  places = [],
}) {

  const [
    clickedPosition,
    setClickedPosition,
  ] = useState(null);

  return (

    <div className="w-full h-full rounded-3xl overflow-hidden">

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      >

        <ResizeMap />

        <CurrentLocation />

        {/* SEARCH */}
        <SearchField
          setCoordinates={setCoordinates}
          setClickedPosition={
            setClickedPosition
          }
          setPlaces={setPlaces}
        />

        {/* MAP LAYERS */}
        <LayersControl position="topright">

          {/* STREET MAP */}
          <LayersControl.BaseLayer
            checked
            name="Street Map"
          >

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

          </LayersControl.BaseLayer>

          {/* SATELLITE */}
          <LayersControl.BaseLayer
            name="Satellite"
          >

            <TileLayer
              attribution="&copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

          </LayersControl.BaseLayer>

        </LayersControl>

        {/* CLICK EVENT */}
        {(setCoordinates ||
          setPlaces) && (

          <LocationMarker
            setCoordinates={
              setCoordinates
            }
            setClickedPosition={
              setClickedPosition
            }
            setPlaces={setPlaces}
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

        {/* ================= VISITED ================= */}

        {visited
          ?.filter(
            (v) =>
              v.latitude &&
              v.longitude
          )
          .map((v) => (

            <Marker
              key={v.id}
              position={[
                Number(v.latitude),
                Number(v.longitude),
              ]}
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

        {/* ================= WISHLIST ================= */}

        {wishlist
          ?.filter(
            (w) =>
              w.latitude &&
              w.longitude
          )
          .map((w) => (

            <Marker
              key={w.id}
              position={[
                Number(w.latitude),
                Number(w.longitude),
              ]}
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

        {/* ================= SAVED SECTION PLACES ================= */}

        {sections?.map((section) => (

          section.places
            ?.filter(
              (place) =>
                place.latitude &&
                place.longitude
            )
            .map((place) => (

              <Marker
                key={place.id}
                position={[
                  Number(
                    place.latitude
                  ),
                  Number(
                    place.longitude
                  ),
                ]}
                icon={createSectionIcon(
                  section.color
                )}
              >

                <Popup>

                  <div className="space-y-1">

                    <b>
                      {place.placeName}
                    </b>

                    <br />

                    {place.stateName}

                    <br />

                    <span
                      style={{
                        color:
                          section.color,
                        fontWeight: 600,
                      }}
                    >
                      {section.title}
                    </span>

                  </div>

                </Popup>

              </Marker>

            ))

        ))}

        {/* ================= TEMP SECTION MARKERS ================= */}

        {places?.map(
          (place, index) => (

            <Marker
              key={index}
              position={[
                Number(
                  place.latitude
                ),
                Number(
                  place.longitude
                ),
              ]}
              icon={createSectionIcon(
                selectedColor ||
                  "#6C4DFF"
              )}
            >

              <Popup>

                <b>
                  {place.placeName}
                </b>

                <br />

                {place.stateName}

              </Popup>

            </Marker>

          )
        )}

      </MapContainer>
    </div>
  );
}