import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slice/auth.slice";

const menu = [
  { name: "Dashboard",        path: "/planner",           icon: "📊", end: true  },
  { name: "Task Manager",     path: "/planner/tasks",     icon: "📝", end: false },
  { name: "Calendar View",    path: "/planner/calendar",  icon: "📅", end: false },
  { name: "Deadline Tracker", path: "/planner/deadlines", icon: "⏰", end: false },
];

export default function PlannerSidebar() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside
      style={{
        width: 280, minWidth: 280, background: "#071B3A",
        minHeight: "100vh", height: "100vh", position: "sticky", top: 0,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "28px 16px", borderRight: "1px solid rgba(255,255,255,0.05)",
        fontFamily: "'Inter', 'Manrope', sans-serif",
      }}
    >
      {/* ── TOP ─────────────────────────────── */}
      <div>
        {/* Logo */}
        <div
          onClick={() => navigate("/planner")}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, paddingLeft: 8, cursor: "pointer" }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg,#2563EB,#00C853)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>
            🗓️
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0, lineHeight: 1.2 }}>Smart Planner</p>
            <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>Organize your life</p>
          </div>
        </div>

        {/* Nav label */}
        <p style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: 12, marginBottom: 8 }}>
          Navigation
        </p>

        {/* Nav items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                textDecoration: "none",
                background: isActive ? "rgba(0,200,83,0.15)" : "transparent",
                borderLeft: isActive ? "3px solid #00C853" : "3px solid transparent",
                color: isActive ? "#00C853" : "#94A3B8",
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                transition: "all 0.25s",
              })}
              className="planner-nav-item"
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* ── BOTTOM ──────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={() => navigate("/home")}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "11px 14px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer",
            background: "transparent", color: "#94A3B8", fontSize: 14, textAlign: "left",
            transition: "all 0.2s", fontFamily: "inherit",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
        >
          <span style={{ fontSize: 16 }}>🏠</span>
          Back to Home
        </button>

        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "4px 0" }} />

        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "transparent", color: "#EF4444", fontSize: 14, textAlign: "left",
            transition: "all 0.2s", fontFamily: "inherit",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          Logout
        </button>
      </div>

      <style>{`
        .planner-nav-item:hover {
          background: rgba(255,255,255,0.05) !important;
          color: #fff !important;
        }
      `}</style>
    </aside>
  );
}