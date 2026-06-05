import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../components/store/slice/auth.slice";

export default function TravelSidebar({ activePage, setActivePage }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleNavigation = (page) => {
    if (location.pathname === "/travel") {
      if (setActivePage) {
        setActivePage(page);
      }
    } else {
      navigate("/travel", { state: { activePage: page } });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-between w-[220px] bg-white border-r border-[#ECECEC] p-5 shrink-0 min-h-screen">
      <div>
        <h1 
          className="text-3xl font-['Playfair_Display'] text-[#222] mb-8 cursor-pointer"
          onClick={() => navigate("/travel")}
        >
          Trip Journal
        </h1>

        <div className="space-y-2">
          {/* DASHBOARD */}
          <div
            onClick={() => handleNavigation("dashboard")}
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
            onClick={() => handleNavigation("map")}
            className={`px-4 py-3 rounded-2xl text-sm cursor-pointer transition-all ${
              activePage === "map"
                ? "bg-[#F1EEFF] text-[#6C4DFF] font-semibold"
                : "text-[#666] hover:bg-[#F8F6F4]"
            }`}
          >
            Map View
          </div>

          {/* VISITED */}
          <div
            onClick={() => handleNavigation("dashboard")}
            className="px-4 py-3 rounded-2xl text-sm text-[#666] hover:bg-[#F8F6F4] cursor-pointer"
          >
            Visited Trips
          </div>

          {/* WISHLIST */}
          <div
            onClick={() => handleNavigation("dashboard")}
            className="px-4 py-3 rounded-2xl text-sm text-[#666] hover:bg-[#F8F6F4] cursor-pointer"
          >
            Wishlist
          </div>

          {/* STATS */}
          <div
            onClick={() => handleNavigation("dashboard")}
            className="px-4 py-3 rounded-2xl text-sm text-[#666] hover:bg-[#F8F6F4] cursor-pointer"
          >
            Statistics
          </div>

          {/* SETTINGS */}
          <div
            onClick={() => handleNavigation("dashboard")}
            className="px-4 py-3 rounded-2xl text-sm text-[#666] hover:bg-[#F8F6F4] cursor-pointer"
          >
            Settings
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="bg-[#6C4DFF] text-white py-3 rounded-2xl text-sm w-full font-semibold transition hover:opacity-90 cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
