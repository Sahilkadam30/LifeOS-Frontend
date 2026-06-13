import { useEffect, useState } from "react";
import API from "../api";
import MapView from "../components/MapView";
import { useNavigate } from "react-router-dom";
import TravelSidebar from "../components/TravelSidebar";
import { FiArrowLeft, FiPlus, FiTrash2, FiMapPin } from "react-icons/fi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function ManageTrip() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("visited");

  // ================= VISITED =================
  const [visitedForm, setVisitedForm] = useState({
    placeName: "",
    type: "",
    visitedOn: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  // ================= WISHLIST =================
  const [wishlistForm, setWishlistForm] = useState({
    placeName: "",
    planDate: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  // ================= SECTION =================
  const [sectionTitle, setSectionTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("#2563EB");
  const [places, setPlaces] = useState([]);

  const sectionColors = [
    "#2563EB", // Primary Blue
    "#16A34A", // Success Green
    "#F97316", // Orange
    "#EF4444", // Danger Red
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#0EA5E9", // Sky Blue
    "#14B8A6", // Teal
    "#EAB308", // Yellow
    "#F43F5E", // Rose
  ];

  // ================= MAP CLICK =================
  const setCoordinates = ({ latitude, longitude, placeName, city }) => {
    if (activeTab === "visited") {
      setVisitedForm({
        ...visitedForm,
        latitude,
        longitude,
        placeName: visitedForm.placeName || placeName,
        city: visitedForm.city || city,
      });
    } else {
      setWishlistForm({
        ...wishlistForm,
        latitude,
        longitude,
        placeName: wishlistForm.placeName || placeName,
        city: wishlistForm.city || city,
      });
    }
  };

  // ================= SAVE VISITED =================
  const saveVisited = async () => {
    if (!visitedForm.placeName.trim() || !visitedForm.latitude || !visitedForm.longitude) {
      alert("Please enter place name and pick a location on map");
      return;
    }
    try {
      await API.post("/visited", visitedForm);
      alert("Visited Place Added Successfully");
      navigate("/travel");
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SAVE WISHLIST =================
  const saveWishlist = async () => {
    if (!wishlistForm.placeName.trim() || !wishlistForm.latitude || !wishlistForm.longitude) {
      alert("Please enter place name and pick a location on map");
      return;
    }
    try {
      await API.post("/wishlist", wishlistForm);
      alert("Wishlist Place Added Successfully");
      navigate("/travel");
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SAVE SECTION =================
  const handleSaveSection = async () => {
    if (!sectionTitle.trim()) {
      alert("Please enter section title");
      return;
    }

    if (places.length === 0) {
      alert("Please add at least one place by clicking on the map");
      return;
    }

    try {
      await API.post("/sections", {
        title: sectionTitle,
        description,
        color: selectedColor,
        places: places.filter((p) => p.latitude && p.longitude),
      });

      alert("Travel Section Created Successfully");
      setSectionTitle("");
      setDescription("");
      setSelectedColor("#2563EB");
      setPlaces([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-['Inter',_sans-serif] flex">
      {/* SIDEBAR */}
      <TravelSidebar activePage="dashboard" />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight leading-none mb-2">
              Manage Journeys
            </h1>
            <p className="text-[#64748B] text-[15px]">
              Organize your visited locations, wishlist items, and custom travel collections.
            </p>
          </div>

          <button
            onClick={() => navigate("/travel")}
            className="flex items-center justify-center gap-2 border border-[#E2E8F0] hover:bg-white bg-slate-50 text-[#1E293B] font-medium px-5 py-3 rounded-[10px] text-[15px] shadow-sm hover:shadow transition-all duration-300"
          >
            <FiArrowLeft className="text-lg" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8 bg-white p-1 rounded-[12px] border border-[#E2E8F0] max-w-md">
          {[
            { id: "visited", label: "Visited" },
            { id: "wishlist", label: "Wishlist" },
            { id: "section", label: "Collections" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-[10px] text-[14px] font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F5F7FA]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= VISITED ================= */}
        {activeTab === "visited" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* FORM */}
            <div className="xl:col-span-5 bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm flex flex-col gap-5">
              <div>
                <h2 className="text-[20px] font-semibold text-[#1E293B] mb-1">
                  Add Visited Place
                </h2>
                <p className="text-[#64748B] text-[13px]">
                  Fill out the form below or pick coordinates on the map.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Place Name
                  </label>
                  <input
                    placeholder="E.g., Eiffel Tower"
                    value={visitedForm.placeName}
                    onChange={(e) => setVisitedForm({ ...visitedForm, placeName: e.target.value })}
                    className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                      Type
                    </label>
                    <input
                      placeholder="E.g., Museum"
                      value={visitedForm.type}
                      onChange={(e) => setVisitedForm({ ...visitedForm, type: e.target.value })}
                      className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                      Visited On
                    </label>
                    <input
                      type="date"
                      value={visitedForm.visitedOn}
                      onChange={(e) => setVisitedForm({ ...visitedForm, visitedOn: e.target.value })}
                      className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                    City / State
                  </label>
                  <input
                    placeholder="E.g., Paris"
                    value={visitedForm.city}
                    onChange={(e) => setVisitedForm({ ...visitedForm, city: e.target.value })}
                    className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-[10px] border border-[#E2E8F0]">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">Latitude</span>
                    <span className="text-[#1E293B] text-[14px] font-mono">{visitedForm.latitude || "Click map..."}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">Longitude</span>
                    <span className="text-[#1E293B] text-[14px] font-mono">{visitedForm.longitude || "Click map..."}</span>
                  </div>
                </div>

                <button
                  onClick={saveVisited}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3 rounded-[10px] text-[15px] shadow-sm hover:shadow transition-all duration-200 mt-2"
                >
                  Save Visited Place
                </button>
              </div>
            </div>

            {/* MAP */}
            <div className="xl:col-span-7 bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-sm min-h-[550px] flex flex-col">
              <div className="mb-4">
                <h2 className="text-[20px] font-semibold text-[#1E293B] mb-1">
                  Select On Map
                </h2>
                <p className="text-[#64748B] text-[13px]">
                  Click anywhere on the map to autofill location coordinates and city names.
                </p>
              </div>

              <div className="flex-1 min-h-[450px] rounded-[10px] overflow-hidden border border-[#E2E8F0]">
                <MapView visited={[]} wishlist={[]} setCoordinates={setCoordinates} />
              </div>
            </div>
          </div>
        )}

        {/* ================= WISHLIST ================= */}
        {activeTab === "wishlist" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* FORM */}
            <div className="xl:col-span-5 bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm flex flex-col gap-5">
              <div>
                <h2 className="text-[20px] font-semibold text-[#1E293B] mb-1">
                  Add Wishlist Place
                </h2>
                <p className="text-[#64748B] text-[13px]">
                  Plan your dream locations and pin them on the map.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Place Name
                  </label>
                  <input
                    placeholder="E.g., Taj Mahal"
                    value={wishlistForm.placeName}
                    onChange={(e) => setWishlistForm({ ...wishlistForm, placeName: e.target.value })}
                    className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={wishlistForm.planDate}
                      onChange={(e) => setWishlistForm({ ...wishlistForm, planDate: e.target.value })}
                      className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                      City / State
                    </label>
                    <input
                      placeholder="E.g., Agra"
                      value={wishlistForm.city}
                      onChange={(e) => setWishlistForm({ ...wishlistForm, city: e.target.value })}
                      className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-[10px] border border-[#E2E8F0]">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">Latitude</span>
                    <span className="text-[#1E293B] text-[14px] font-mono">{wishlistForm.latitude || "Click map..."}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">Longitude</span>
                    <span className="text-[#1E293B] text-[14px] font-mono">{wishlistForm.longitude || "Click map..."}</span>
                  </div>
                </div>

                <button
                  onClick={saveWishlist}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3 rounded-[10px] text-[15px] shadow-sm hover:shadow transition-all duration-200 mt-2"
                >
                  Save Wishlist Place
                </button>
              </div>
            </div>

            {/* MAP */}
            <div className="xl:col-span-7 bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-sm min-h-[550px] flex flex-col">
              <div className="mb-4">
                <h2 className="text-[20px] font-semibold text-[#1E293B] mb-1">
                  Select On Map
                </h2>
                <p className="text-[#64748B] text-[13px]">
                  Click anywhere on the map to pick wishlist coordinates.
                </p>
              </div>

              <div className="flex-1 min-h-[450px] rounded-[10px] overflow-hidden border border-[#E2E8F0]">
                <MapView visited={[]} wishlist={[]} setCoordinates={setCoordinates} />
              </div>
            </div>
          </div>
        )}

        {/* ================= CREATE SECTION ================= */}
        {activeTab === "section" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* FORM */}
            <div className="xl:col-span-5 bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm flex flex-col gap-5">
              <div>
                <h2 className="text-[20px] font-semibold text-[#1E293B] mb-1">
                  Create Collection
                </h2>
                <p className="text-[#64748B] text-[13px]">
                  Group destinations into a custom-colored travel bucket list.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Collection Title
                  </label>
                  <input
                    placeholder="E.g., EuroTrip 2026"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B] resize-none"
                  />
                </div>

                {/* COLORS */}
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
                    Accent Color
                  </label>
                  <div className="flex gap-2 flex-wrap pt-0.5">
                    {sectionColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                          selectedColor === color
                            ? "border-slate-800 scale-110 shadow-sm"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* DESTINATIONS */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                      Added Destinations
                    </label>
                    <span className="text-[11px] font-bold bg-slate-100 text-[#64748B] px-2 py-0.5 rounded-[6px]">
                      {places.length} Places
                    </span>
                  </div>

                  {places.length === 0 ? (
                    <div className="border border-dashed border-[#E2E8F0] rounded-[10px] p-6 text-center bg-slate-50">
                      <p className="text-[#94A3B8] text-[13px]">
                        Click on the map to add cities to this collection
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {places.map((place, index) => (
                        <div
                          key={index}
                          className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] p-3 flex justify-between items-center"
                        >
                          <div>
                            <h4 className="text-[14px] font-semibold text-[#1E293B]">
                              {place.placeName}
                            </h4>
                            <p className="text-[12px] text-[#64748B] mt-0.5">
                              {place.stateName}
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              const updated = places.filter((_, i) => i !== index);
                              setPlaces(updated);
                            }}
                            className="text-[#64748B] hover:text-[#EF4444] p-1.5 rounded-full hover:bg-slate-200/50 transition-colors"
                          >
                            <FiTrash2 className="text-[15px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSaveSection}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3 rounded-[10px] text-[15px] shadow-sm hover:shadow transition-all duration-200 mt-2"
                >
                  Create Collection
                </button>
              </div>
            </div>

            {/* MAP */}
            <div className="xl:col-span-7 bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-sm min-h-[550px] flex flex-col">
              <div className="mb-4">
                <h2 className="text-[20px] font-semibold text-[#1E293B] mb-1">
                  Add Places to Collection
                </h2>
                <p className="text-[#64748B] text-[13px]">
                  Each place you click on the map will be added to the checklist above.
                </p>
              </div>

              <div className="flex-1 min-h-[450px] rounded-[10px] overflow-hidden border border-[#E2E8F0]">
                <MapView
                  visited={[]}
                  wishlist={[]}
                  sections={[]}
                  setCoordinates={({ latitude, longitude, placeName, city }) => {
                    const alreadyExists = places.some(
                      (p) =>
                        Number(p.latitude).toFixed(4) === Number(latitude).toFixed(4) &&
                        Number(p.longitude).toFixed(4) === Number(longitude).toFixed(4)
                    );
                    if (alreadyExists) return;

                    setPlaces((prev) => [
                      ...prev,
                      {
                        placeName,
                        stateName: city || "Unknown City",
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
    </div>
  );
}