import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slice/auth.slice";
import {
  FiMusic,
  FiMic,
  FiActivity,
  FiClock,
  FiHeart,
  FiFolder,
  FiPlus,
  FiHome,
  FiLogOut,
  FiCompass,
} from "react-icons/fi";

export default function MusicSidebar({
  activeFilter,
  setActiveFilter,
  onOpenUpload,
  onOpenNewProject,
  stats,
  showFavoritesOnly,
  setShowFavoritesOnly,
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
    { id: "ALL", label: "All Library", icon: FiMusic, badge: stats?.totalRecordings },
    { id: "SONG", label: "Songs", icon: "🎼", badge: stats?.songsCount },
    { id: "SINGING", label: "Singing & Vocals", icon: FiMic, badge: stats?.singingCount },
    { id: "INSTRUMENTS", label: "Instruments", icon: "🎸", badge: stats?.instrumentsCount },
    { id: "PRACTICE", label: "Practice Sessions", icon: FiClock, badge: stats?.practiceSessionsCount },
    { id: "MUSIC_IDEA", label: "Music Ideas", icon: "💡", badge: stats?.musicIdeasCount },
    { id: "PROJECTS", label: "Projects & Albums", icon: FiFolder, badge: null },
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
        padding: "24px 16px",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'Inter', sans-serif",
        zIndex: 40,
      }}
    >
      {/* ── TOP SECTION ───────────────────────────────── */}
      <div>
        {/* LOGO */}
        <div
          onClick={() => {
            setActiveFilter("ALL");
            setShowFavoritesOnly(false);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
            paddingLeft: 8,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "linear-gradient(135deg, #10B981, #3B82F6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
            }}
          >
            <FiMusic style={{ color: "#fff", fontSize: 22 }} />
          </div>
          <div>
            <p
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              🎵 Music Studio
            </p>
            <p style={{ color: "#94A3B8", fontSize: 11, margin: "2px 0 0", fontStyle: "italic" }}>
              Create. Record. Practice. Remember.
            </p>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          <button
            type="button"
            onClick={onOpenUpload}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "11px 16px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #10B981 0%, #2563EB 100%)",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <FiPlus style={{ fontSize: 18, strokeWidth: 2.5 }} />
            <span>Upload Recording</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewProject}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "9px 14px",
              borderRadius: 10,
              border: "1px solid rgba(139, 92, 246, 0.4)",
              cursor: "pointer",
              background: "rgba(139, 92, 246, 0.12)",
              color: "#C4B5FD",
              fontWeight: 600,
              fontSize: 13,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.22)";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.12)";
              e.currentTarget.style.color = "#C4B5FD";
            }}
          >
            <FiFolder style={{ fontSize: 14 }} />
            <span>New Music Project</span>
          </button>
        </div>

        {/* SECTION LABEL */}
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
          Studio Library
        </p>

        {/* NAV ITEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {menuItems.map((item) => {
            const active = activeFilter === item.id && !showFavoritesOnly;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveFilter(item.id);
                  setShowFavoritesOnly(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: active ? "rgba(16, 185, 129, 0.15)" : "transparent",
                  borderLeft: active ? "3px solid #10B981" : "3px solid transparent",
                  color: active ? "#10B981" : "#94A3B8",
                  fontWeight: active ? 600 : 500,
                  fontSize: 14,
                  transition: "all 0.15s ease",
                  textAlign: "left",
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
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {typeof Icon === "string" ? (
                    <span style={{ fontSize: 16 }}>{Icon}</span>
                  ) : (
                    <Icon style={{ fontSize: 16, flexShrink: 0 }} />
                  )}
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 10,
                      background: active
                        ? "rgba(16,185,129,0.25)"
                        : "rgba(255,255,255,0.08)",
                      color: active ? "#10B981" : "#64748B",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* FAVORITES NAV ITEM */}
          <button
            type="button"
            onClick={() => setShowFavoritesOnly(true)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: showFavoritesOnly ? "rgba(239, 68, 68, 0.15)" : "transparent",
              borderLeft: showFavoritesOnly ? "3px solid #EF4444" : "3px solid transparent",
              color: showFavoritesOnly ? "#EF4444" : "#94A3B8",
              fontWeight: showFavoritesOnly ? 600 : 500,
              fontSize: 14,
              transition: "all 0.15s ease",
              textAlign: "left",
              marginTop: 4,
            }}
            onMouseEnter={(e) => {
              if (!showFavoritesOnly) {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#fff";
              }
            }}
            onMouseLeave={(e) => {
              if (!showFavoritesOnly) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#94A3B8";
              }
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FiHeart
                style={{
                  fontSize: 16,
                  fill: showFavoritesOnly ? "#EF4444" : "none",
                  color: "#EF4444",
                }}
              />
              <span>Favorite Recordings</span>
            </div>
            {stats?.favoritesCount !== undefined && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 10,
                  background: showFavoritesOnly
                    ? "rgba(239,68,68,0.25)"
                    : "rgba(255,255,255,0.08)",
                  color: showFavoritesOnly ? "#EF4444" : "#64748B",
                }}
              >
                {stats.favoritesCount}
              </span>
            )}
          </button>

          {/* Ask Music AI Button */}
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("open-lifeos-chat", {
                  detail: {
                    message: "Tell me about my music studio projects, tracks, and practice stats.",
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
              border: "1px solid rgba(139, 92, 246, 0.4)",
              cursor: "pointer",
              background: "rgba(139, 92, 246, 0.15)",
              color: "#C4B5FD",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.15s ease",
              textAlign: "left",
              marginTop: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.25)";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.15)";
              e.currentTarget.style.color = "#C4B5FD";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>✨</span>
              <span>Ask Music AI</span>
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: "2px 6px",
                borderRadius: 8,
                background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
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
          type="button"
          onClick={() => navigate("/home")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            cursor: "pointer",
            background: "transparent",
            color: "#94A3B8",
            fontSize: 14,
            textAlign: "left",
            transition: "all 0.2s",
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
          type="button"
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: "#EF4444",
            fontSize: 14,
            textAlign: "left",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <FiLogOut style={{ fontSize: 16 }} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
