import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slice/auth.slice";
import {
  FiTarget,
  FiZap,
  FiCompass,
  FiAward,
  FiPlus,
  FiHome,
  FiLogOut,
  FiCheckCircle,
  FiLayers
} from "react-icons/fi";

export default function LifeGoalsSidebar({
  activeFilter,
  setActiveFilter,
  onOpenAddModal,
  onOpenAchievements,
  stats
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    { id: "ALL", label: "Life Roadmap", icon: FiCompass, badge: stats?.totalGoals },
    { id: "SHORT_TERM", label: "Short-Term Goals", icon: FiZap, badge: stats?.shortTermGoals },
    { id: "LONG_TERM", label: "Long-Term Goals", icon: FiLayers, badge: stats?.longTermGoals },
    { id: "COMPLETED", label: "Completed Goals", icon: FiCheckCircle, badge: stats?.completed },
  ];

  return (
    <aside
      style={{
        width: 280,
        minWidth: 280,
        background: "#071B3A",
        minHeight: "100vh",
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "28px 16px",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'Inter', 'Manrope', sans-serif",
        zIndex: 40
      }}
    >
      {/* ── TOP SECTION ───────────────────────────────── */}
      <div>
        {/* LOGO */}
        <div
          onClick={() => setActiveFilter("ALL")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 28,
            paddingLeft: 8,
            cursor: "pointer"
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "linear-gradient(135deg,#6366F1,#10B981)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)"
            }}
          >
            <FiTarget style={{ color: "#fff", fontSize: 22 }} />
          </div>
          <div>
            <p
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                margin: 0,
                lineHeight: 1.2
              }}
            >
              Life Goals
            </p>
            <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>
              Personal Life Roadmap
            </p>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTON */}
        <button
          onClick={onOpenAddModal}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 16px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, #3B82F6 0%, #10B981 100%)",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "0 4px 14px rgba(59, 130, 246, 0.35)",
            transition: "all 0.25s ease",
            marginBottom: 28
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(59, 130, 246, 0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(59, 130, 246, 0.35)";
          }}
        >
          <FiPlus style={{ fontSize: 18, strokeWidth: 2.5 }} />
          <span>Add New Goal</span>
        </button>

        {/* SECTION LABEL */}
        <p
          style={{
            color: "#64748B",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            paddingLeft: 12,
            marginBottom: 8
          }}
        >
          Roadmap Navigation
        </p>

        {/* NAV ITEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {menuItems.map((item) => {
            const active = activeFilter === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFilter(item.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: active ? "rgba(16,185,129,0.15)" : "transparent",
                  borderLeft: active ? "3px solid #10B981" : "3px solid transparent",
                  color: active ? "#10B981" : "#94A3B8",
                  fontWeight: active ? 600 : 500,
                  fontSize: 14,
                  transition: "all 0.2s",
                  textAlign: "left"
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#94A3B8";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon style={{ fontSize: 16, flexShrink: 0 }} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 10,
                      background: active ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.08)",
                      color: active ? "#10B981" : "#64748B"
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* ACHIEVEMENTS BUTTON */}
          <button
            onClick={onOpenAchievements}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: 10,
              border: "1px solid rgba(245, 158, 11, 0.25)",
              cursor: "pointer",
              background: "rgba(245, 158, 11, 0.08)",
              color: "#FBBF24",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.2s",
              textAlign: "left",
              marginTop: 6
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(245, 158, 11, 0.18)";
              e.currentTarget.style.color = "#FDE68A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(245, 158, 11, 0.08)";
              e.currentTarget.style.color = "#FBBF24";
            }}
          >
            <FiAward style={{ fontSize: 17, flexShrink: 0 }} />
            <span>Trophy Room</span>
          </button>

          {/* Ask Goal AI Button */}
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("open-lifeos-chat", {
                  detail: {
                    message: "Give me an overview of my life goals, milestones, and priority roadmap.",
                  },
                })
              );
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(99, 102, 241, 0.4)",
              cursor: "pointer",
              background: "rgba(99, 102, 241, 0.15)",
              color: "#C7D2FE",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.15s ease",
              textAlign: "left",
              marginTop: 10,
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(99, 102, 241, 0.25)";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(99, 102, 241, 0.15)";
              e.currentTarget.style.color = "#C7D2FE";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>✨</span>
              <span>Ask Goal AI</span>
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: "2px 6px",
                borderRadius: 8,
                background: "linear-gradient(135deg, #6366F1, #10B981)",
                color: "#FFFFFF",
                letterSpacing: "0.5px",
              }}
            >
              RAG
            </span>
          </button>
        </div>
      </div>

      {/* ── BOTTOM SECTION ────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={() => navigate("/home")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            cursor: "pointer",
            background: "transparent",
            color: "#94A3B8",
            fontSize: 14,
            textAlign: "left",
            transition: "all 0.2s",
            fontFamily: "inherit"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#94A3B8";
          }}
        >
          <FiHome style={{ fontSize: 16 }} />
          <span>Back to Home</span>
        </button>

        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "4px 0" }} />

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 14px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: "#EF4444",
            fontSize: 14,
            textAlign: "left",
            transition: "all 0.2s",
            fontFamily: "inherit"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <FiLogOut style={{ fontSize: 16 }} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
