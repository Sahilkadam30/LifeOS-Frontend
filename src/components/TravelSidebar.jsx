import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../components/store/slice/auth.slice";
import { 
  FiMap, 
  FiCompass, 
  FiHeart, 
  FiBarChart2, 
  FiSettings, 
  FiLogOut,
  FiAward,
  FiHome
} from "react-icons/fi";

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

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiCompass },
    { id: "map", label: "Map View", icon: FiMap },
    { id: "visited", label: "Visited Trips", icon: FiAward },
    { id: "wishlist", label: "Wishlist", icon: FiHeart },
    { id: "stats", label: "Statistics", icon: FiBarChart2 },
  ];

  return (
    <div style={{
      width: 280,
      minWidth: 280,
      background: "#071B3A",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "28px 16px",
      position: "sticky",
      top: 0,
      height: "100vh",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div>
        {/* LOGO */}
        <div 
          onClick={() => navigate("/travel")}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, paddingLeft: 8, cursor: "pointer" }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg,#2563EB,#00C853)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FiMap style={{ color: "#fff", fontSize: 20 }} />
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0, lineHeight: 1.2 }}>Trip Journal</p>
            <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>Travel Companion</p>
          </div>
        </div>

        {/* SECTION LABEL */}
        <p style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: 12, marginBottom: 8 }}>
          Navigation
        </p>

        {/* NAVIGATION ITEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {menuItems.map((item) => {
            const active = activePage === item.id;
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                  background: active ? "rgba(0,200,83,0.15)" : "transparent",
                  borderLeft: active ? "3px solid #00C853" : "3px solid transparent",
                  color: active ? "#00C853" : "#94A3B8",
                  fontWeight: active ? 600 : 400,
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; } }}
              >
                <Icon style={{ fontSize: 16, flexShrink: 0 }} />
                <span>{item.label}</span>
              </div>
            );
          })}

          {/* SETTINGS */}
          <div
            onClick={() => handleNavigation("dashboard")}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, cursor: "pointer",
              background: "transparent",
              borderLeft: "3px solid transparent",
              color: "#94A3B8",
              fontWeight: 400,
              fontSize: 14,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
          >
            <FiSettings style={{ fontSize: 16, flexShrink: 0 }} />
            <span>Settings</span>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={() => navigate("/home")}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer",
            background: "transparent", color: "#94A3B8", fontSize: 14, textAlign: "left",
            transition: "all 0.2s",
            fontFamily: "'Inter', sans-serif"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
        >
          <FiHome style={{ fontSize: 16 }} />
          <span>Back to Home</span>
        </button>

        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "8px 0" }} />

        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "transparent", color: "#EF4444", fontSize: 14, textAlign: "left",
            transition: "all 0.2s",
            fontFamily: "'Inter', sans-serif"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          <FiLogOut style={{ fontSize: 16 }} />
          Logout
        </button>
      </div>
    </div>
  );
}
