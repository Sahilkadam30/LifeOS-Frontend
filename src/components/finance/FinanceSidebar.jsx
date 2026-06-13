import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, CreditCard, Landmark, LineChart, Home, Zap } from "lucide-react";

const navItems = [
  { to: "/finance/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/finance/expenses", icon: CreditCard, label: "Expense Tracker" },
  { to: "/finance/savings", icon: Landmark, label: "Savings Tracker" },
  { to: "/finance/investments", icon: LineChart, label: "Investment Tracker" },
];

export default function FinanceSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

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
          onClick={() => navigate("/finance/dashboard")}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, paddingLeft: 8, cursor: "pointer" }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg,#2563EB,#00C853)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Landmark style={{ color: "#fff", fontSize: 20 }} />
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0, lineHeight: 1.2 }}>Finance Hub</p>
            <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>Money Manager</p>
          </div>
        </div>

        {/* SECTION LABEL */}
        <p style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: 12, marginBottom: 8 }}>
          Navigation
        </p>

        {/* NAVIGATION ITEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                  background: active ? "rgba(0,200,83,0.15)" : "transparent",
                  borderLeft: active ? "3px solid #00C853" : "3px solid transparent",
                  color: active ? "#00C853" : "#94A3B8",
                  fontWeight: active ? 600 : 400,
                  fontSize: 14,
                  transition: "all 0.2s",
                  textDecoration: "none"
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; } }}
              >
                <Icon style={{ fontSize: 16, flexShrink: 0 }} />
                <span>{item.label}</span>
              </Link>
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
            padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer",
            background: "transparent", color: "#94A3B8", fontSize: 14, textAlign: "left",
            transition: "all 0.2s",
            fontFamily: "'Inter', sans-serif"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
        >
          <Home style={{ fontSize: 16 }} />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
}