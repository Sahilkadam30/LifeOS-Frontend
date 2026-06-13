import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import MapView from "../components/MapView";
import TravelSections from "../pages/TravelSections";
import TravelSidebar from "../components/TravelSidebar";
import { FiPlus, FiMapPin, FiCompass, FiBriefcase, FiGlobe } from "react-icons/fi";

export default function VisitedPlace() {
  const [visited, setVisited] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [sections, setSections] = useState([]);

  const [showAllVisited, setShowAllVisited] = useState(false);
  const [showAllWishlist, setShowAllWishlist] = useState(false);
  const [showAllSections, setShowAllSections] = useState(false);

  const location = useLocation();
  const [activePage, setActivePage] = useState(location.state?.activePage || "dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.activePage) {
      setActivePage(location.state.activePage);
    }
  }, [location.state]);

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
    <div className="min-h-screen bg-[#F5F7FA] font-['Inter',_sans-serif] flex">
      {/* SIDEBAR */}
      <TravelSidebar activePage={activePage} setActivePage={setActivePage} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight leading-none mb-2">
              {activePage === "dashboard" ? "Travel Dashboard" : "Travel Map"}
            </h1>
            <p className="text-[#64748B] text-[15px]">
              {activePage === "dashboard"
                ? "Track explored territories, dream bucket lists, and customs collections."
                : "Explore your mapped memories and planned voyages."}
            </p>
          </div>

          <button
            onClick={() => navigate("/manage-trip")}
            className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium px-5 py-3 rounded-[10px] text-[15px] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <FiPlus className="text-lg" />
            <span>Add Journey</span>
          </button>
        </div>

        {/* ================= DASHBOARD VIEW ================= */}
        {activePage === "dashboard" ? (
          <>
            {/* STATS CARDS */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {/* Visited Places Card */}
              <div 
                className="bg-white rounded-[16px] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-t-4 border-[#2563EB]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Visited Places
                  </span>
                  <FiCompass className="text-[#2563EB] text-lg" />
                </div>
                <h2 className="text-[36px] font-bold text-[#1E293B] leading-none mt-1">
                  {visited.length}
                </h2>
              </div>

              {/* Wishlist Places Card */}
              <div 
                className="bg-white rounded-[16px] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-t-4 border-[#F59E0B]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Wishlist Places
                  </span>
                  <FiGlobe className="text-[#F59E0B] text-lg" />
                </div>
                <h2 className="text-[36px] font-bold text-[#1E293B] leading-none mt-1">
                  {wishlist.length}
                </h2>
              </div>

              {/* Cities Explored Card */}
              <div 
                className="bg-white rounded-[16px] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-t-4 border-[#16A34A]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Cities Explored
                  </span>
                  <FiMapPin className="text-[#16A34A] text-lg" />
                </div>
                <h2 className="text-[36px] font-bold text-[#1E293B] leading-none mt-1">
                  {new Set(visited.map((v) => v.city).filter(Boolean)).size}
                </h2>
              </div>

              {/* Total Trips Card */}
              <div 
                className="bg-white rounded-[16px] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-t-4 border-[#8B5CF6]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Total Tracked
                  </span>
                  <FiBriefcase className="text-[#8B5CF6] text-lg" />
                </div>
                <h2 className="text-[36px] font-bold text-[#1E293B] leading-none mt-1">
                  {visited.length + wishlist.length}
                </h2>
              </div>
            </div>

            {/* TWO ROW GRID SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* VISITED TABLE/LIST CARD */}
              <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-5 border-b border-[#F1F5F9] pb-3">
                    <h2 className="text-[18px] font-bold text-[#1E293B]">
                      Visited Trips
                    </h2>
                    <button
                      className="text-[#2563EB] hover:text-[#1D4ED8] text-[13px] font-semibold transition-colors"
                      onClick={() => setShowAllVisited(!showAllVisited)}
                    >
                      {showAllVisited ? "Show Less" : "View All"}
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {(showAllVisited ? visited : visited.slice(0, 4)).map((v) => (
                      <div
                        key={v.id}
                        className="bg-[#F8FAFC] border border-[#E2E8F0]/40 rounded-[10px] p-3.5 flex justify-between items-center hover:bg-[#F1F5F9] transition-colors"
                      >
                        <div>
                          <h3 className="font-semibold text-[14px] text-[#1E293B]">
                            {v.placeName}
                          </h3>
                          <p className="text-[#64748B] text-[12px] mt-0.5">
                            {v.type} • {v.city}
                          </p>
                        </div>
                        <span className="text-[11px] font-medium text-[#64748B] bg-[#E2E8F0]/50 px-2 py-0.5 rounded-[6px]">
                          {v.visitedOn ? new Date(v.visitedOn).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}
                        </span>
                      </div>
                    ))}
                    {visited.length === 0 && (
                      <p className="text-center text-[#94A3B8] text-[14px] py-8">No visited places tracked yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* WISHLIST TABLE/LIST CARD */}
              <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-5 border-b border-[#F1F5F9] pb-3">
                    <h2 className="text-[18px] font-bold text-[#1E293B]">
                      Travel Wishlist
                    </h2>
                    <button
                      className="text-[#2563EB] hover:text-[#1D4ED8] text-[13px] font-semibold transition-colors"
                      onClick={() => setShowAllWishlist(!showAllWishlist)}
                    >
                      {showAllWishlist ? "Show Less" : "View All"}
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {(showAllWishlist ? wishlist : wishlist.slice(0, 4)).map((w) => (
                      <div
                        key={w.id}
                        className="bg-[#F8FAFC] border border-[#E2E8F0]/40 rounded-[10px] p-3.5 flex justify-between items-center hover:bg-[#F1F5F9] transition-colors"
                      >
                        <div>
                          <h3 className="font-semibold text-[14px] text-[#1E293B]">
                            {w.placeName}
                          </h3>
                          <p className="text-[#64748B] text-[12px] mt-0.5">
                            {w.city || "Target City"}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-[#F59E0B] bg-[#FFF9EB] border border-[#F59E0B]/20 px-2 py-0.5 rounded-[6px]">
                          {w.planDate ? new Date(w.planDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Soon"}
                        </span>
                      </div>
                    ))}
                    {wishlist.length === 0 && (
                      <p className="text-center text-[#94A3B8] text-[14px] py-8">No wishlist places added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* COLLECTIONS LIST CARD */}
              <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-5 border-b border-[#F1F5F9] pb-3">
                    <h2 className="text-[18px] font-bold text-[#1E293B]">
                      Collections
                    </h2>
                    <button
                      className="text-[#2563EB] hover:text-[#1D4ED8] text-[13px] font-semibold transition-colors"
                      onClick={() => setShowAllSections(!showAllSections)}
                    >
                      {showAllSections ? "Show Less" : "View All"}
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {(showAllSections ? sections : sections.slice(0, 4)).map((section) => (
                      <div
                        key={section.id}
                        className="bg-[#F8FAFC] border border-[#E2E8F0]/40 rounded-[10px] p-3.5 flex justify-between items-center hover:bg-[#F1F5F9] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3.5 h-3.5 rounded-full shadow-inner flex-shrink-0"
                            style={{ backgroundColor: section.color || "#2563EB" }}
                          />
                          <div>
                            <h3 className="font-semibold text-[14px] text-[#1E293B]">
                              {section.title}
                            </h3>
                            <p className="text-[#64748B] text-[12px] mt-0.5">
                              {section.places?.length || 0} Destinations
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {sections.length === 0 && (
                      <p className="text-center text-[#94A3B8] text-[14px] py-8">No collections created yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Sections lists grid */}
            <div className="mt-8 pt-4 border-t border-[#E2E8F0]">
              <h2 className="text-[22px] font-semibold text-[#1E293B] mb-6">
                Active Sections
              </h2>
              <TravelSections />
            </div>
          </>
        ) : (
          /* ================= MAP VIEW ================= */
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-sm h-[calc(100vh-180px)] min-h-[550px] flex flex-col">
            <div className="flex-1 rounded-[10px] overflow-hidden border border-[#E2E8F0] relative">
              <MapView visited={visited} wishlist={wishlist} sections={sections} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}