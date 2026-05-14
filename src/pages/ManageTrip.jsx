import { useEffect, useState } from "react";
import API from "../api";
import MapView from "../components/MapView";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

export default function ManageTrip() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("visited");

  // ================= VISITED =================
  const [visitedForm, setVisitedForm] =
    useState({
      placeName: "",
      type: "",
      visitedOn: "",
      city: "",
      latitude: "",
      longitude: "",
    });

  // ================= WISHLIST =================
  const [wishlistForm, setWishlistForm] =
    useState({
      placeName: "",
      planDate: "",
      city: "",
      latitude: "",
      longitude: "",
    });

  // ================= SECTION =================
  const [sectionTitle, setSectionTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [selectedColor, setSelectedColor] =
    useState("#6C4DFF");

  const [places, setPlaces] = useState([]);

  const sectionColors = [
    "#6C4DFF",
    "#22C55E",
    "#F97316",
    "#EC4899",
    "#0EA5E9",
    "#EAB308",
  ];

  // ================= SECTION ICON =================
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
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [18, 18],
    });
  }

  // ================= MAP CLICK FOR SECTION =================
  function MapClickHandler({ setPlaces }) {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;

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
            },
          ]);
        } catch (err) {
          console.log(err);
        }
      },
    });

    return null;
  }

  // ================= MAP CLICK =================
  const setCoordinates = ({
    latitude,
    longitude,
    placeName,
    city,
  }) => {
    if (activeTab === "visited") {
      setVisitedForm({
        ...visitedForm,
        latitude,
        longitude,

        placeName:
          visitedForm.placeName ||
          placeName,

        city:
          visitedForm.city || city,
      });
    } else {
      setWishlistForm({
        ...wishlistForm,
        latitude,
        longitude,

        placeName:
          wishlistForm.placeName ||
          placeName,

        city:
          wishlistForm.city || city,
      });
    }
  };

  // ================= SAVE VISITED =================
  const saveVisited = async () => {
    try {
      await API.post(
        "/visited",
        visitedForm
      );

      alert("Visited Place Added");

      navigate("/travel");
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SAVE WISHLIST =================
  const saveWishlist = async () => {
    try {
      await API.post(
        "/wishlist",
        wishlistForm
      );

      alert("Wishlist Place Added");

      navigate("/travel");
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SAVE SECTION =================
  const handleSaveSection =
    async () => {
      if (!sectionTitle.trim()) {
        alert(
          "Please enter section title"
        );
        return;
      }

      if (places.length === 0) {
        alert(
          "Please add at least one place"
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

        alert("Section Created");

        setSectionTitle("");
        setDescription("");
        setSelectedColor("#6C4DFF");
        setPlaces([]);

      } catch (err) {
        console.log(err);
      }
    };

  return (
    <div className="min-h-screen bg-[#F8F6F4] px-5 md:px-8 py-6 font-['Inter']">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-['Playfair_Display'] text-[#222]">
            Manage Journeys
          </h1>

          <p className="text-[#777] text-sm mt-2">
            Organize trips, wishlist and
            travel collections beautifully.
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/travel")
          }
          className="bg-[#6C4DFF] text-white px-6 py-4 rounded-3xl shadow-sm text-sm hover:scale-105 transition-all"
        >
          Back To Dashboard
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-8 flex-wrap">

        <button
          onClick={() =>
            setActiveTab("visited")
          }
          className={`px-6 py-4 rounded-3xl text-sm transition-all ${
            activeTab === "visited"
              ? "bg-[#6C4DFF] text-white shadow-sm"
              : "bg-white text-[#666]"
          }`}
        >
          Add Visited
        </button>

        <button
          onClick={() =>
            setActiveTab("wishlist")
          }
          className={`px-6 py-4 rounded-3xl text-sm transition-all ${
            activeTab === "wishlist"
              ? "bg-[#6C4DFF] text-white shadow-sm"
              : "bg-white text-[#666]"
          }`}
        >
          Add Wishlist
        </button>

        <button
          onClick={() =>
            setActiveTab("section")
          }
          className={`px-6 py-4 rounded-3xl text-sm transition-all ${
            activeTab === "section"
              ? "bg-[#6C4DFF] text-white shadow-sm"
              : "bg-white text-[#666]"
          }`}
        >
          Create Section
        </button>
      </div>

      {/* ================= VISITED ================= */}
      {activeTab === "visited" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* FORM */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm">

            <h2 className="text-3xl font-['Playfair_Display'] text-[#222] mb-6">
              Add Visited Place
            </h2>

            <div className="space-y-5">

              <input
                placeholder="Place Name"
                value={
                  visitedForm.placeName
                }
                onChange={(e) =>
                  setVisitedForm({
                    ...visitedForm,
                    placeName:
                      e.target.value,
                  })
                }
                className="w-full bg-[#F8F6F4] rounded-3xl px-5 py-4 outline-none text-base"
              />

              <input
                placeholder="Type"
                value={visitedForm.type}
                onChange={(e) =>
                  setVisitedForm({
                    ...visitedForm,
                    type: e.target.value,
                  })
                }
                className="w-full bg-[#F8F6F4] rounded-3xl px-5 py-4 outline-none text-base"
              />

              <input
                type="date"
                onChange={(e) =>
                  setVisitedForm({
                    ...visitedForm,
                    visitedOn:
                      e.target.value,
                  })
                }
                className="w-full bg-[#F8F6F4] rounded-3xl px-5 py-4 outline-none text-base"
              />

              <input
                placeholder="City"
                value={visitedForm.city}
                onChange={(e) =>
                  setVisitedForm({
                    ...visitedForm,
                    city: e.target.value,
                  })
                }
                className="w-full bg-[#F8F6F4] rounded-3xl px-5 py-4 outline-none text-base"
              />

              <input
                placeholder="Latitude"
                value={
                  visitedForm.latitude
                }
                readOnly
                className="w-full bg-[#F8F6F4] rounded-3xl px-5 py-4 outline-none text-base"
              />

              <input
                placeholder="Longitude"
                value={
                  visitedForm.longitude
                }
                readOnly
                className="w-full bg-[#F8F6F4] rounded-3xl px-5 py-4 outline-none text-base"
              />

              <button
                onClick={saveVisited}
                className="bg-[#6C4DFF] text-white w-full py-4 rounded-3xl text-base shadow-sm"
              >
                Save Visited Place
              </button>
            </div>
          </div>

          {/* MAP */}
          <div className="bg-white rounded-[32px] p-5 shadow-sm h-[750px]">

            <h2 className="text-3xl font-['Playfair_Display'] text-[#222] mb-5">
              Select On Map
            </h2>

            <div className="h-[650px] rounded-[28px] overflow-hidden">
              <MapView
                visited={[]}
                wishlist={[]}
                setCoordinates={
                  setCoordinates
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= WISHLIST ================= */}
      {activeTab === "wishlist" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* FORM */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm">

            <h2 className="text-3xl font-['Playfair_Display'] text-[#222] mb-6">
              Add Wishlist Place
            </h2>

            <div className="space-y-5">

              <input
                placeholder="Place Name"
                value={
                  wishlistForm.placeName
                }
                onChange={(e) =>
                  setWishlistForm({
                    ...wishlistForm,
                    placeName:
                      e.target.value,
                  })
                }
                className="w-full bg-[#F8F6F4] rounded-3xl px-5 py-4 outline-none text-base"
              />

              <input
                type="date"
                onChange={(e) =>
                  setWishlistForm({
                    ...wishlistForm,
                    planDate:
                      e.target.value,
                  })
                }
                className="w-full bg-[#F8F6F4] rounded-3xl px-5 py-4 outline-none text-base"
              />

              <input
                placeholder="City"
                value={wishlistForm.city}
                onChange={(e) =>
                  setWishlistForm({
                    ...wishlistForm,
                    city: e.target.value,
                  })
                }
                className="w-full bg-[#F8F6F4] rounded-3xl px-5 py-4 outline-none text-base"
              />

              <input
                placeholder="Latitude"
                value={
                  wishlistForm.latitude
                }
                readOnly
                className="w-full bg-[#F8F6F4] rounded-3xl px-5 py-4 outline-none text-base"
              />

              <input
                placeholder="Longitude"
                value={
                  wishlistForm.longitude
                }
                readOnly
                className="w-full bg-[#F8F6F4] rounded-3xl px-5 py-4 outline-none text-base"
              />

              <button
                onClick={saveWishlist}
                className="bg-[#6C4DFF] text-white w-full py-4 rounded-3xl text-base shadow-sm"
              >
                Save Wishlist Place
              </button>
            </div>
          </div>

          {/* MAP */}
          <div className="bg-white rounded-[32px] p-5 shadow-sm h-[750px]">

            <h2 className="text-3xl font-['Playfair_Display'] text-[#222] mb-5">
              Select On Map
            </h2>

            <div className="h-[650px] rounded-[28px] overflow-hidden">
              <MapView
                visited={[]}
                wishlist={[]}
                setCoordinates={
                  setCoordinates
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= CREATE SECTION ================= */}
      
      {/* ================= CREATE SECTION ================= */}
{activeTab === "section" && (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

    {/* FORM */}
    <div className="bg-white rounded-[32px] p-8 shadow-sm">

      <h2 className="text-3xl font-['Playfair_Display'] text-[#222] mb-2">
        Create Section
      </h2>

      <p className="text-[#777] text-sm mb-6">
        Build custom travel collections.
      </p>

      <div className="space-y-5">

        <input
          placeholder="Section Title"
          value={sectionTitle}
          onChange={(e) =>
            setSectionTitle(e.target.value)
          }
          className="w-full bg-[#F8F6F4] rounded-3xl px-5 py-4 outline-none text-base"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows={4}
          className="w-full bg-[#F8F6F4] rounded-3xl px-5 py-4 outline-none text-base resize-none"
        />

        {/* COLORS */}
        <div>

          <p className="text-sm text-[#666] mb-4">
            Choose Section Color
          </p>

          <div className="flex gap-4 flex-wrap">

            {sectionColors.map((color) => (

              <button
                key={color}
                onClick={() =>
                  setSelectedColor(color)
                }
                className={`w-10 h-10 rounded-full border-4 transition-all ${
                  selectedColor === color
                    ? "border-black scale-110"
                    : "border-white"
                }`}
                style={{
                  background: color,
                }}
              />

            ))}

          </div>
        </div>

        {/* DESTINATIONS */}
        <div className="mt-6">

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-xl font-['Playfair_Display'] text-[#222]">
              Added Destinations
            </h3>

            <span className="text-sm text-[#777]">
              {places.length} Places
            </span>

          </div>

          {places.length === 0 ? (

            <div className="bg-[#F8F6F4] rounded-3xl p-8 text-center">

              <p className="text-[#888] text-sm">
                Search or click on the map to add destinations
              </p>

            </div>

          ) : (

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">

              {places.map((place, index) => (

                <div
                  key={index}
                  className="bg-[#F8F6F4] rounded-3xl p-5 border border-[#ECECEC]"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <h4 className="text-lg font-semibold text-[#222]">
                        {place.placeName}
                      </h4>

                      <p className="text-sm text-[#777] mt-1">
                        {place.stateName}
                      </p>

                      <div className="flex gap-2 mt-3 flex-wrap">

                        <span className="bg-white px-3 py-1 rounded-full text-xs text-[#666]">
                          Lat: {Number(place.latitude).toFixed(4)}
                        </span>

                        <span className="bg-white px-3 py-1 rounded-full text-xs text-[#666]">
                          Lng: {Number(place.longitude).toFixed(4)}
                        </span>

                      </div>

                    </div>

                    <button
                      onClick={() => {

                        const updated =
                          places.filter(
                            (_, i) => i !== index
                          );

                        setPlaces(updated);

                      }}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        <button
          onClick={handleSaveSection}
          className="bg-[#6C4DFF] text-white w-full py-4 rounded-3xl text-base shadow-sm"
        >
          Save Section
        </button>

      </div>
    </div>

    {/* MAP */}
    <div className="bg-white rounded-[32px] p-5 shadow-sm h-[850px]">

      <h2 className="text-3xl font-['Playfair_Display'] text-[#222] mb-2">
        Add Destinations
      </h2>

      <p className="text-sm text-[#777] mb-5">
        Search or click anywhere on map to add places.
      </p>

      <div className="h-[720px] rounded-[28px] overflow-hidden border border-[#ECECEC]">

        <MapView
          visited={[]}
          wishlist={[]}
          sections={[]}
          setCoordinates={({
            latitude,
            longitude,
            placeName,
            city,
          }) => {

            const alreadyExists =
              places.some(
                (p) =>
                  Number(p.latitude).toFixed(4) ===
                    Number(latitude).toFixed(4) &&
                  Number(p.longitude).toFixed(4) ===
                    Number(longitude).toFixed(4)
              );

            if (alreadyExists) return;

            setPlaces((prev) => [
              ...prev,
              {
                placeName,
                stateName: city,
                latitude,
                longitude,
                visited: false,
              },
            ]);

          }}
        />

      </div>
    </div>
  </div>
)}
    </div>
  );
}