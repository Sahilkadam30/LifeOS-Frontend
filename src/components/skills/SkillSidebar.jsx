import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  BookOpen,
  Clock3,
  Home,
  LayoutDashboard,
  ListChecks,
  LogOut,
  NotebookText,
  Trophy,
} from "lucide-react";
import { logout } from "../store/slice/auth.slice";

const menu = [
  { label: "Dashboard", path: "/skills/dashboard", icon: LayoutDashboard, end: true },
  { label: "Subjects", path: "/skills/subjects", icon: BookOpen },
  { label: "Study Sessions", path: "/skills/study-sessions", icon: Clock3 },
  { label: "Learning Journal", path: "/skills/journal", icon: NotebookText },
  { label: "Skill Progress", path: "/skills/progress", icon: ListChecks },
  { label: "Achievements", path: "/skills/achievements", icon: Trophy },
];

export default function SkillSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside
      style={{
        width: 280,
        minWidth: 280,
        minHeight: "100vh",
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "#071B3A",
        color: "#FFFFFF",
        padding: "28px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, paddingLeft: 8 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg,#2563EB,#00C853)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={20} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 17, lineHeight: 1.2 }}>Skill Tracker</p>
            <p style={{ margin: 0, color: "#94A3B8", fontSize: 12 }}>Learn with focus</p>
          </div>
        </div>

        <p
          style={{
            color: "#64748B",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            paddingLeft: 12,
            marginBottom: 8,
          }}
        >
          Navigation
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {menu.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className="skill-nav-item"
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 10,
                textDecoration: "none",
                background: isActive ? "rgba(0,200,83,0.15)" : "transparent",
                borderLeft: isActive ? "3px solid #00C853" : "3px solid transparent",
                color: isActive ? "#00C853" : "#94A3B8",
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                transition: "all 0.2s",
              })}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          type="button"
          onClick={() => navigate("/home")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "transparent",
            color: "#94A3B8",
            fontSize: 14,
            textAlign: "left",
          }}
        >
          <Home size={16} />
          Back to Home
        </button>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 14px",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            color: "#EF4444",
            fontSize: 14,
            textAlign: "left",
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <style>{`
        .skill-nav-item:hover {
          background: rgba(255,255,255,0.05) !important;
          color: #fff !important;
        }
      `}</style>
    </aside>
  );
}