import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slice/auth.slice";
import { 
  FiGrid, 
  FiFilm, 
  FiBookOpen, 
  FiCoffee, 
  FiStar, 
  FiHome, 
  FiLogOut,
  FiBookmark
} from "react-icons/fi";

export default function JournalSidebar({ activeTab, setActiveTab, stats = {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    { 
      id: "overview", 
      label: "Overview", 
      icon: FiGrid,
      count: null
    },
    { 
      id: "movies", 
      label: "Movies & Shows", 
      icon: FiFilm,
      count: stats.totalMovies ?? null
    },
    { 
      id: "books", 
      label: "Books & Reading", 
      icon: FiBookOpen,
      count: stats.totalBooks ?? null
    },
    { 
      id: "food", 
      label: "Food & Dining", 
      icon: FiCoffee,
      count: stats.totalFood ?? null
    },
    { 
      id: "favourites", 
      label: "Things I Love", 
      icon: FiStar,
      count: stats.totalFavourites ?? null
    },
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
          onClick={() => setActiveTab("overview")}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36, paddingLeft: 8, cursor: "pointer" }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 16px rgba(139, 92, 246, 0.25)"
          }}>
            <FiBookmark style={{ color: "#fff", fontSize: 22 }} />
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0, lineHeight: 1.2 }}>Life Journal</p>
            <p style={{ color: "#94A3B8", fontSize: 12, margin: 0, marginTop: 2 }}>Taste & Cultural Log</p>
          </div>
        </div>

        {/* SECTION LABEL */}
        <p style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: 12, marginBottom: 10 }}>
          Journal Modules
        </p>

        {/* NAVIGATION ITEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {menuItems.map((item) => {
            const active = activeTab === item.id;
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                  background: active ? "rgba(139, 92, 246, 0.16)" : "transparent",
                  borderLeft: active ? "3px solid #8B5CF6" : "3px solid transparent",
                  color: active ? "#A78BFA" : "#94A3B8",
                  fontWeight: active ? 600 : 400,
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; } }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon style={{ fontSize: 17, flexShrink: 0 }} />
                  <span>{item.label}</span>
                </div>
                {item.count !== null && item.count !== undefined && (
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 7px",
                    borderRadius: 10,
                    background: active ? "#8B5CF6" : "rgba(255,255,255,0.08)",
                    color: "#fff"
                  }}>
                    {item.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={() => navigate("/home")}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer",
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

        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "4px 0" }} />

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
