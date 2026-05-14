import { useEffect, useState } from "react";
import API from "../api";
import MapView from "../components/MapView";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import {
  GeoSearchControl,
  OpenStreetMapProvider,
} from "leaflet-geosearch";

import { useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

// ================= COLORS =================

const sectionColors = [
  "#6C4DFF",
  "#22C55E",
  "#F97316",
  "#EC4899",
  "#0EA5E9",
  "#EAB308",
];

// ================= COLOR ICON =================

function createColorIcon(color) {

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

// ================= SEARCH CONTROL =================

function SearchField({
  setPlaces,
  selectedColor,
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

    map.on(
      "geosearch/showlocation",

      async (result) => {

        const lat =
          result.location.y;

        const lng =
          result.location.x;

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
            "Unknown Place";

          const stateName =
            data.address?.state ||
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "";

          setPlaces((prev) => [

            ...prev,

            {
              placeName,
              stateName,
              latitude: lat,
              longitude: lng,
              visited: false,
              color: selectedColor,
            },
          ]);

        } catch (err) {
          console.log(err);
        }
      }
    );

    return () => {

      map.removeControl(searchControl);

    };

  }, [map, selectedColor]);

  return null;
}

// ================= MAP CLICK =================

function MapClickHandler({
  setPlaces,
  selectedColor,
}) {

  useMapEvents({

    async click(e) {

      const { lat, lng } =
        e.latlng;

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
          "Unknown Place";

        const stateName =
          data.address?.state ||
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          "";

        setPlaces((prev) => [

          ...prev,

          {
            placeName,
            stateName,
            latitude: lat,
            longitude: lng,
            visited: false,
            color: selectedColor,
          },
        ]);

      } catch (err) {
        console.log(err);
      }
    },
  });

  return null;
}

// ================= MAIN COMPONENT =================

export default function TravelSections() {

  const [sections, setSections] =
    useState([]);

  const [sectionTitle,
    setSectionTitle] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [selectedColor,
    setSelectedColor] =
    useState("#6C4DFF");

  const [places,
    setPlaces] =
    useState([]);

  // ================= FETCH =================

  const fetchSections = async () => {

    try {

      const res =
        await API.get("/sections");

      setSections(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // ================= SAVE =================

  const handleSave = async () => {

    if (!sectionTitle.trim()) {

      alert(
        "Please enter section title"
      );

      return;
    }

    if (places.length === 0) {

      alert(
        "Please add at least one destination"
      );

      return;
    }

    try {

      await API.post("/sections", {

        title: sectionTitle,

        description,

        color: selectedColor,

        places: places.filter(
          (p) =>
            p.latitude &&
            p.longitude
        ),
      });

      setSectionTitle("");

      setDescription("");

      setSelectedColor(
        "#6C4DFF"
      );

      setPlaces([]);

      fetchSections();

    } catch (err) {
      console.log(err);
    }
  };

  return (

    <div className="space-y-6">

      {/* ================= CREATE SECTION ================= */}

      <div className="bg-white rounded-[32px]
      p-6 shadow-sm border border-[#ECECEC]">

        {/* HEADER */}

        <div className="mb-6">

          <h2 className="text-[32px]
          font-['Playfair_Display']
          text-[#222]">

            Create Travel Section

          </h2>

          <p className="text-[#777]
          text-[15px] mt-2">

            Search destinations or click
            on map to create your journey.

          </p>

        </div>

        {/* FORM */}

        <div className="space-y-5 mb-6">

          <input
            className="w-full bg-[#F8F6F4]
            border border-[#ECECEC]
            rounded-[22px]
            px-5 py-4
            text-[15px]
            outline-none"

            placeholder="Section Title"

            value={sectionTitle}

            onChange={(e) =>
              setSectionTitle(
                e.target.value
              )
            }
          />

          <textarea
            rows={3}

            className="w-full bg-[#F8F6F4]
            border border-[#ECECEC]
            rounded-[22px]
            px-5 py-4
            text-[15px]
            outline-none resize-none"

            placeholder="Description"

            value={description}

            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

          {/* COLORS */}

          <div>

            <p className="text-[15px]
            text-[#555] mb-4">

              Choose Section Color

            </p>

            <div className="flex gap-4 flex-wrap">

              {sectionColors.map(
                (color) => (

                  <button
                    key={color}

                    type="button"

                    onClick={() =>
                      setSelectedColor(
                        color
                      )
                    }

                    className={`w-10 h-10 rounded-full
                    border-[4px] transition-all ${
                      selectedColor === color
                        ? "border-black scale-110"
                        : "border-white"
                    }`}

                    style={{
                      background: color,
                    }}
                  />
                )
              )}

            </div>

          </div>

        </div>

        {/* MAP */}

        <div className="rounded-[28px]
        overflow-hidden
        h-[450px]
        border border-[#ECECEC]
        mb-6">

          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}

            style={{
              width: "100%",
              height: "100%",
            }}
          >

            {/* SEARCH */}

            <SearchField
              setPlaces={setPlaces}
              selectedColor={
                selectedColor
              }
            />

            {/* TILE */}

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"

              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* CLICK */}

            <MapClickHandler
              setPlaces={setPlaces}
              selectedColor={
                selectedColor
              }
            />

            {/* TEMP PLACES */}

            {places.map(
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

                  icon={createColorIcon(
                    selectedColor
                  )}
                >

                  <Popup>

                    <b>
                      {
                        place.placeName
                      }
                    </b>

                    <br />

                    {place.stateName}

                  </Popup>

                </Marker>
              )
            )}

          </MapContainer>

        </div>

        {/* ADDED DESTINATIONS */}

        <div className="space-y-4 mb-6">

          {places.map(
            (place, index) => (

              <div
                key={index}

                className="bg-[#F8F6F4]
                rounded-[24px]
                p-5 flex
                justify-between
                items-center"
              >

                <div>

                  <div className="flex items-center gap-3">

                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        background:
                          selectedColor,
                      }}
                    ></div>

                    <h3 className="text-[16px]
                    font-semibold
                    text-[#222]">

                      {
                        place.placeName
                      }

                    </h3>

                  </div>

                  <p className="text-[14px]
                  text-[#777]
                  mt-2">

                    {place.stateName}

                  </p>

                </div>

                <button
                  onClick={() => {

                    const updated =
                      places.filter(
                        (_, i) =>
                          i !== index
                      );

                    setPlaces(updated);
                  }}

                  className="text-red-500
                  text-[14px]"
                >
                  Remove
                </button>

              </div>
            )
          )}

        </div>

        {/* SAVE */}

        <button
          onClick={handleSave}

          className="bg-[#6C4DFF]
          text-white
          px-6 py-4
          rounded-[22px]
          text-[15px]
          shadow-sm
          hover:scale-105
          transition-all"
        >

          Save Section

        </button>

      </div>

      {/* ================= SECTION LIST ================= */}

      <div className="grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-3
      gap-6">

        {sections.map((section) => {

          const visitedCount =
            section.places.filter(
              (p) => p.visited
            ).length;

          const total =
            section.places.length;

          const percent =
            Math.round(
              (visitedCount /
                total) *
                100
            ) || 0;

          return (

            <div
              key={section.id}

              className="bg-white
              rounded-[30px]
              p-6 shadow-sm
              border border-[#ECECEC]"
            >

              {/* TOP */}

              <div className="flex
              justify-between
              items-start mb-5">

                <div className="flex gap-3">

                  <div
                    className="w-4 h-4 rounded-full mt-1"
                    style={{
                      background:
                        section.color,
                    }}
                  ></div>

                  <div>

                    <h3 className="text-[22px]
                    font-['Playfair_Display']
                    text-[#222]">

                      {section.title}

                    </h3>

                    <p className="text-[14px]
                    text-[#777]
                    mt-2">

                      {
                        section.description
                      }

                    </p>

                  </div>

                </div>

                <button
                  className="text-[#888]
                  text-[20px]"

                  onClick={async () => {

                    try {

                      await API.delete(
                        `/sections/${section.id}`
                      );

                      fetchSections();

                    } catch (err) {
                      console.log(err);
                    }
                  }}
                >
                  ⋮
                </button>

              </div>

              {/* PROGRESS */}

              <div className="mb-5">

                <div className="flex
                justify-between
                text-[14px]
                mb-3">

                  <span className="text-[#666]">

                    {visitedCount}
                    {" "}of {total} visited

                  </span>

                  <span
                    className="font-semibold"

                    style={{
                      color:
                        section.color,
                    }}
                  >

                    {percent}%

                  </span>

                </div>

                <div className="w-full
                h-[10px]
                bg-[#ECECEC]
                rounded-full overflow-hidden">

                  <div
                    className="h-full rounded-full"

                    style={{
                      width: `${percent}%`,
                      background:
                        section.color,
                    }}
                  ></div>

                </div>

              </div>

              {/* DESTINATIONS */}

              <div className="space-y-4">

                {section.places.map(
                  (place) => (

                    <div
                      key={place.id}

                      className="bg-[#F8F6F4]
                      rounded-[22px]
                      p-4 flex
                      justify-between
                      items-center"
                    >

                      <div>

                        <h4 className="text-[15px]
                        font-semibold
                        text-[#222]">

                          {
                            place.placeName
                          }

                        </h4>

                        <p className="text-[13px]
                        text-[#777]
                        mt-1">

                          {
                            place.stateName
                          }

                        </p>

                      </div>

                      <input
                        type="checkbox"

                        checked={
                          place.visited
                        }

                        className="w-5 h-5"

                        style={{
                          accentColor:
                            section.color,
                        }}

                        onChange={async () => {

                          try {

                            const updatedPlaces =
                              section.places.map(
                                (p) => {

                                  if (
                                    p.id ===
                                    place.id
                                  ) {

                                    return {
                                      ...p,

                                      visited:
                                        !p.visited,
                                    };
                                  }

                                  return p;
                                }
                              );

                            await API.put(
                              `/sections/${section.id}`,

                              {
                                ...section,

                                places:
                                  updatedPlaces,
                              }
                            );

                            fetchSections();

                          } catch (err) {
                            console.log(err);
                          }
                        }}
                      />

                    </div>
                  )
                )}

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}