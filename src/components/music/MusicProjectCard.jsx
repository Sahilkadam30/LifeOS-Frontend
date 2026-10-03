import React from "react";
import { FiFolder, FiEdit2, FiTrash2, FiMusic, FiPlayCircle } from "react-icons/fi";

export default function MusicProjectCard({
  project,
  onSelectProject,
  onEdit,
  onDelete,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "IDEA":
        return { label: "💡 IDEA", bg: "rgba(234,179,8,0.15)", color: "#FBBF24" };
      case "IN_PROGRESS":
        return { label: "⚡ IN PROGRESS", bg: "rgba(59,130,246,0.15)", color: "#60A5FA" };
      case "COMPLETED":
        return { label: "✅ COMPLETED", bg: "rgba(16,185,129,0.15)", color: "#34D399" };
      default:
        return { label: status, bg: "rgba(255,255,255,0.1)", color: "#94A3B8" };
    }
  };

  const badge = getStatusBadge(project.status);

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #0b1a30, #081528)",
        borderRadius: 16,
        border: "1px solid rgba(139, 92, 246, 0.25)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 14,
        position: "relative",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(139, 92, 246, 0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#A78BFA",
              }}
            >
              <FiFolder style={{ fontSize: 20 }} />
            </div>
            <div>
              <h4 style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 700, margin: 0 }}>
                {project.name}
              </h4>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 6,
                  background: badge.bg,
                  color: badge.color,
                  display: "inline-block",
                  marginTop: 3,
                }}
              >
                {badge.label}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              type="button"
              onClick={() => onEdit(project)}
              title="Edit Project"
              style={{
                background: "transparent",
                border: "none",
                color: "#94A3B8",
                cursor: "pointer",
                padding: 6,
              }}
            >
              <FiEdit2 style={{ fontSize: 15 }} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(project)}
              title="Delete Project"
              style={{
                background: "transparent",
                border: "none",
                color: "#EF4444",
                cursor: "pointer",
                padding: 6,
              }}
            >
              <FiTrash2 style={{ fontSize: 15 }} />
            </button>
          </div>
        </div>

        {project.description && (
          <p
            style={{
              color: "#94A3B8",
              fontSize: 13,
              lineHeight: 1.4,
              margin: "6px 0 12px",
            }}
          >
            {project.description}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#A78BFA", fontSize: 13, fontWeight: 600 }}>
          <FiMusic />
          <span>{project.recordingsCount || 0} tracks inside</span>
        </div>

        <button
          type="button"
          onClick={() => onSelectProject(project)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid rgba(139, 92, 246, 0.4)",
            background: "rgba(139, 92, 246, 0.15)",
            color: "#C4B5FD",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <FiPlayCircle /> View Tracks
        </button>
      </div>
    </div>
  );
}
