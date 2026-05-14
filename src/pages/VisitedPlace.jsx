import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import MapView from "../components/MapView";
import TravelSections from "../pages/TravelSections";

export default function VisitedPlace() {

  const [visited, setVisited] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [sections, setSections] = useState([]);

  // ✅ ACTIVE SIDEBAR PAGE
  const [activePage, setActivePage] =
    useState("dashboard");

  const navigate = useNavigate();

  const fetchData = async () => {
    try {

      const v = await API.get("/visited");
      const w = await API.get("/wishlist");

      setVisited(v.data);
      setWishlist(w.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

  const loadData = async () => {

    await fetchData();

    try {

      const s = await API.get("/sections");

      setSections(s.data);

    } catch (err) {
      console.log(err);
    }
  };

  loadData();

}, []);

  return (
    <div className="min-h-screen bg-[#F8F6F4] font-['Inter'] flex">

      {/* SIDEBAR */}
      <div className="hidden lg:flex flex-col justify-between w-[220px] bg-white border-r border-[#ECECEC] p-5">

        <div>

          <h1 className="text-3xl font-['Playfair_Display'] text-[#222] mb-8">
            Trip Journal
          </h1>

          <div className="space-y-2">

            {/* DASHBOARD */}
            <div
              onClick={() =>
                setActivePage("dashboard")
              }
              className={`px-4 py-3 rounded-2xl text-sm cursor-pointer transition-all ${
                activePage === "dashboard"
                  ? "bg-[#F1EEFF] text-[#6C4DFF] font-semibold"
                  : "text-[#666] hover:bg-[#F8F6F4]"
              }`}
            >
              Dashboard
            </div>

            {/* MAP VIEW */}
            <div
              onClick={() =>
                setActivePage("map")
              }
              className={`px-4 py-3 rounded-2xl text-sm cursor-pointer transition-all ${
                activePage === "map"
                  ? "bg-[#F1EEFF] text-[#6C4DFF] font-semibold"
                  : "text-[#666] hover:bg-[#F8F6F4]"
              }`}
            >
              Map View
            </div>

            {/* VISITED */}
            <div className="px-4 py-3 rounded-2xl text-sm text-[#666] hover:bg-[#F8F6F4] cursor-pointer">
              Visited Trips
            </div>

            {/* WISHLIST */}
            <div className="px-4 py-3 rounded-2xl text-sm text-[#666] hover:bg-[#F8F6F4] cursor-pointer">
              Wishlist
            </div>

            {/* STATS */}
            <div className="px-4 py-3 rounded-2xl text-sm text-[#666] hover:bg-[#F8F6F4] cursor-pointer">
              Statistics
            </div>

            {/* SETTINGS */}
            <div className="px-4 py-3 rounded-2xl text-sm text-[#666] hover:bg-[#F8F6F4] cursor-pointer">
              Settings
            </div>

          </div>
        </div>

        <button className="bg-[#6C4DFF] text-white py-3 rounded-2xl text-sm">
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 px-4 md:px-6 py-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>

            <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] text-[#222]">
              {activePage === "dashboard"
                ? "Dashboard"
                : "Travel Map"}
            </h1>

            <p className="text-[#777] text-sm mt-1">
              {activePage === "dashboard"
                ? "Organize your journeys beautifully."
                : "Explore all your travel memories on the map."}
            </p>

          </div>

          <button
            className="bg-[#6C4DFF] text-white px-5 py-3 rounded-2xl text-sm shadow-sm hover:scale-105 transition"
            onClick={() => navigate("/manage-trip")}
          >
            + Add Journey
          </button>

        </div>

        {/* ================= DASHBOARD ================= */}
        {activePage === "dashboard" && (

          <>
            {/* STATS */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

              <div className="bg-[#FFF6D8] rounded-3xl p-4 shadow-sm">

                <p className="text-[#777] text-sm">
                  Visited Places
                </p>

                <h2 className="text-2xl font-semibold mt-2">
                  {visited.length}
                </h2>

              </div>

              <div className="bg-[#FFE7EC] rounded-3xl p-4 shadow-sm">

                <p className="text-[#777] text-sm">
                  Wishlist Places
                </p>

                <h2 className="text-2xl font-semibold mt-2">
                  {wishlist.length}
                </h2>

              </div>

              <div className="bg-[#DDF6E4] rounded-3xl p-4 shadow-sm">

                <p className="text-[#777] text-sm">
                  Cities Explored
                </p>

                <h2 className="text-2xl font-semibold mt-2">
                  {
                    new Set(
                      visited.map((v) => v.city)
                    ).size
                  }
                </h2>

              </div>

              <div className="bg-[#E4F0FF] rounded-3xl p-4 shadow-sm">

                <p className="text-[#777] text-sm">
                  Total Trips
                </p>

                <h2 className="text-2xl font-semibold mt-2">
                  {visited.length + wishlist.length}
                </h2>

              </div>

            </div>

            {/* CONTENT */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

              {/* VISITED */}
              <div className="bg-white rounded-3xl p-5 shadow-sm">

                <div className="flex justify-between items-center mb-5">

                  <h2 className="text-2xl font-['Playfair_Display'] text-[#222]">
                    Visited Trips
                  </h2>

                  <span className="text-[#6C4DFF] text-sm cursor-pointer">
                    View All
                  </span>

                </div>

                <div className="space-y-3">

                  {visited.map((v) => (

                    <div
                      key={v.id}
                      className="bg-[#F8F6F4] rounded-2xl p-4 flex justify-between items-center"
                    >

                      <div>

                        <h3 className="font-semibold text-base text-[#222]">
                          {v.placeName}
                        </h3>

                        <p className="text-[#777] text-sm mt-1">
                          {v.type} • {v.city}
                        </p>

                      </div>

                      <p className="text-xs text-[#888]">
                        {v.visitedOn}
                      </p>

                    </div>

                  ))}

                </div>
              </div>

              {/* WISHLIST */}
              <div className="bg-white rounded-3xl p-5 shadow-sm">

                <div className="flex justify-between items-center mb-5">

                  <h2 className="text-2xl font-['Playfair_Display'] text-[#222]">
                    Wishlist
                  </h2>

                  <span className="text-[#6C4DFF] text-sm cursor-pointer">
                    View All
                  </span>

                </div>

                <div className="space-y-3">

                  {wishlist.map((w) => (

                    <div
                      key={w.id}
                      className="bg-[#F8F6F4] rounded-2xl p-4 flex justify-between items-center"
                    >

                      <div>

                        <h3 className="font-semibold text-base text-[#222]">
                          {w.placeName}
                        </h3>

                        <p className="text-[#777] text-sm mt-1">
                          {w.city}
                        </p>

                      </div>

                      <p className="text-xs text-[#888]">
                        {w.planDate}
                      </p>

                    </div>

                  ))}

                </div>
              </div>

            </div>
          </>
        )}

        {/* ================= MAP VIEW ================= */}
        {/* RIGHT SECTION */}


      </div>
    </div>
  );
}