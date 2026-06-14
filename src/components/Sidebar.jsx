import {
  FiBookOpen,
  FiEdit3,
  FiFileText,
  FiStar,
  FiLogOut,
  FiZap,
  FiHome,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../components/store/slice/auth.slice";

const NAV_ITEMS = [
  { tab: "NOTE",  label: "Notes",        icon: FiFileText },
  { tab: "STORY", label: "Storytelling", icon: FiBookOpen },
  { tab: "POEM",  label: "Poems",        icon: FiEdit3    },
];

const Sidebar = ({ activeTab, setActiveTab, showFavorites, setShowFavorites }) => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (tab) => activeTab === tab && !showFavorites;

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
    }}>
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, paddingLeft: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg,#2563EB,#00C853)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FiZap style={{ color: "#fff", fontSize: 20 }} />
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0, lineHeight: 1.2 }}>My Space</p>
            <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>Writings & Notes</p>
          </div>
        </div>

        {/* SECTION LABEL */}
        <p style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: 12, marginBottom: 8 }}>
          Categories
        </p>

        {/* NAV ITEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map(({ tab, label, icon: Icon }) => {
            const active = isActive(tab);
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setShowFavorites(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: active ? "rgba(0,200,83,0.15)" : "transparent",
                  borderLeft: active ? "3px solid #00C853" : "3px solid transparent",
                  color: active ? "#00C853" : "#94A3B8",
                  fontWeight: active ? 600 : 400,
                  fontSize: 14,
                  transition: "all 0.2s",
                  textAlign: "left",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; } }}
              >
                <Icon style={{ fontSize: 16, flexShrink: 0 }} />
                {label}
              </button>
            );
          })}

          {/* FAVORITES */}
          <button
            onClick={() => setShowFavorites(true)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer",
              background: showFavorites ? "rgba(0,200,83,0.15)" : "transparent",
              borderLeft: showFavorites ? "3px solid #00C853" : "3px solid transparent",
              color: showFavorites ? "#00C853" : "#94A3B8",
              fontWeight: showFavorites ? 600 : 400,
              fontSize: 14,
              transition: "all 0.2s",
              textAlign: "left",
            }}
            onMouseEnter={e => { if (!showFavorites) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; } }}
            onMouseLeave={e => { if (!showFavorites) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; } }}
          >
            <FiStar style={{ fontSize: 16, flexShrink: 0 }} />
            Favorites
          </button>
        </div>
      </div>

      {/* BOTTOM */}
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
};

export default Sidebar;