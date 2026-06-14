import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LayoutDashboard, Dumbbell, Target, Home, LogOut, Zap, Utensils } from "lucide-react";
import { logout } from "../store/slice/auth.slice";

export default function GymSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

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
          onClick={() => navigate("/gym/dashboard")}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, paddingLeft: 8, cursor: "pointer" }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg,#2563EB,#00C853)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap style={{ color: "#fff", size: 20 }} />
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0, lineHeight: 1.2 }}>Fitness Hub</p>
            <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>Active Lifestyle</p>
          </div>
        </div>

        {/* SECTION LABEL */}
        <p style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: 12, marginBottom: 8 }}>
          Navigation
        </p>

        {/* NAVIGATION ITEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* DASHBOARD */}
          <NavLink 
            to="/gym/dashboard"
            style={({ isActive }) => ({
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, cursor: "pointer",
              background: isActive ? "rgba(0,200,83,0.15)" : "transparent",
              borderLeft: isActive ? "3px solid #00C853" : "3px solid transparent",
              color: isActive ? "#00C853" : "#94A3B8",
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              transition: "all 0.2s",
              textDecoration: "none"
            })}
            onMouseEnter={e => { 
              if (!e.currentTarget.classList.contains("active")) { 
                e.currentTarget.style.background = "rgba(255,255,255,0.05)"; 
                e.currentTarget.style.color = "#fff"; 
              } 
            }}
            onMouseLeave={e => { 
              if (!e.currentTarget.classList.contains("active")) { 
                e.currentTarget.style.background = "transparent"; 
                e.currentTarget.style.color = "#94A3B8"; 
              } 
            }}
          >
            <LayoutDashboard size={16} style={{ flexShrink: 0 }} />
            <span>Dashboard</span>
          </NavLink>

          {/* WORKOUTS */}
          <NavLink 
            to="/gym/workouts"
            style={({ isActive }) => ({
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, cursor: "pointer",
              background: isActive ? "rgba(0,200,83,0.15)" : "transparent",
              borderLeft: isActive ? "3px solid #00C853" : "3px solid transparent",
              color: isActive ? "#00C853" : "#94A3B8",
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              transition: "all 0.2s",
              textDecoration: "none"
            })}
            onMouseEnter={e => { 
              if (!e.currentTarget.classList.contains("active")) { 
                e.currentTarget.style.background = "rgba(255,255,255,0.05)"; 
                e.currentTarget.style.color = "#fff"; 
              } 
            }}
            onMouseLeave={e => { 
              if (!e.currentTarget.classList.contains("active")) { 
                e.currentTarget.style.background = "transparent"; 
                e.currentTarget.style.color = "#94A3B8"; 
              } 
            }}
          >
            <Dumbbell size={16} style={{ flexShrink: 0 }} />
            <span>Workout Log</span>
          </NavLink>

          {/* GOALS */}
          <NavLink 
            to="/gym/goals"
            style={({ isActive }) => ({
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, cursor: "pointer",
              background: isActive ? "rgba(0,200,83,0.15)" : "transparent",
              borderLeft: isActive ? "3px solid #00C853" : "3px solid transparent",
              color: isActive ? "#00C853" : "#94A3B8",
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              transition: "all 0.2s",
              textDecoration: "none"
            })}
            onMouseEnter={e => { 
              if (!e.currentTarget.classList.contains("active")) { 
                e.currentTarget.style.background = "rgba(255,255,255,0.05)"; 
                e.currentTarget.style.color = "#fff"; 
              } 
            }}
            onMouseLeave={e => { 
              if (!e.currentTarget.classList.contains("active")) { 
                e.currentTarget.style.background = "transparent"; 
                e.currentTarget.style.color = "#94A3B8"; 
              } 
            }}
          >
            <Target size={16} style={{ flexShrink: 0 }} />
            <span>Fitness Goals</span>
          </NavLink>

          {/* MEAL PLANNER */}
          <NavLink 
            to="/gym/meals"
            style={({ isActive }) => ({
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, cursor: "pointer",
              background: isActive ? "rgba(0,200,83,0.15)" : "transparent",
              borderLeft: isActive ? "3px solid #00C853" : "3px solid transparent",
              color: isActive ? "#00C853" : "#94A3B8",
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              transition: "all 0.2s",
              textDecoration: "none"
            })}
            onMouseEnter={e => { 
              if (!e.currentTarget.classList.contains("active")) { 
                e.currentTarget.style.background = "rgba(255,255,255,0.05)"; 
                e.currentTarget.style.color = "#fff"; 
              } 
            }}
            onMouseLeave={e => { 
              if (!e.currentTarget.classList.contains("active")) { 
                e.currentTarget.style.background = "transparent"; 
                e.currentTarget.style.color = "#94A3B8"; 
              } 
            }}
          >
            <Utensils size={16} style={{ flexShrink: 0 }} />
            <span>Meal Planner</span>
          </NavLink>
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
          <Home size={16} />
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
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}