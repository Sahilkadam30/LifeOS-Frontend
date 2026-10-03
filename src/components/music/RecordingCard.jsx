import React, { useState } from "react";
import {
  FiHeart,
  FiMoreVertical,
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiInfo,
  FiClock,
  FiFolder,
} from "react-icons/fi";
import AudioPlayer from "./AudioPlayer";
import { getStreamUrl, downloadRecordingFile } from "../../services/musicApi";

export const RECORDING_TYPE_INFO = {
  SONG: { label: "Song", icon: "🎼", color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
  SINGING: { label: "Singing", icon: "🎤", color: "#EC4899", bg: "rgba(236,72,153,0.15)" },
  GUITAR: { label: "Guitar", icon: "🎸", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  PIANO: { label: "Piano", icon: "🎹", color: "#8B5CF6", bg: "rgba(139,92,246,0.15)" },
  KEYBOARD: { label: "Keyboard", icon: "🎹", color: "#6366F1", bg: "rgba(99,102,241,0.15)" },
  DRUMS: { label: "Drums", icon: "🥁", color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
  FLUTE: { label: "Flute", icon: "🪈", color: "#14B8A6", bg: "rgba(20,184,166,0.15)" },
  VIOLIN: { label: "Violin", icon: "🎻", color: "#D97706", bg: "rgba(217,119,6,0.15)" },
  OTHER_INSTRUMENT: { label: "Instrument", icon: "🎺", color: "#06B6D4", bg: "rgba(6,182,212,0.15)" },
  MUSIC_IDEA: { label: "Music Idea", icon: "💡", color: "#EAB308", bg: "rgba(234,179,8,0.15)" },
  PRACTICE: { label: "Practice", icon: "⏱️", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
  OTHER: { label: "Other", icon: "🎧", color: "#94A3B8", bg: "rgba(148,163,184,0.15)" },
};

export default function RecordingCard({
  recording,
  activePlayerId,
  onPlay,
  onToggleFavorite,
  onEdit,
  onDelete,
  onViewDetails,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const typeConfig = RECORDING_TYPE_INFO[recording.recordingType] || RECORDING_TYPE_INFO.OTHER;
  const streamUrl = getStreamUrl(recording.id);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      setIsDownloading(true);
      setShowMenu(false);
      await downloadRecordingFile(recording.id, recording.originalFileName || `${recording.title}.mp3`);
    } catch (err) {
      console.error("Failed to download recording:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #0b1a30, #081528)",
        borderRadius: 16,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 14,
        position: "relative",
        transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.3)";
        e.currentTarget.style.boxShadow = "0 14px 30px -5px rgba(0, 0, 0, 0.55)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
        e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.4)";
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: typeConfig.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              border: `1px solid ${typeConfig.color}40`,
              flexShrink: 0,
            }}
          >
            {typeConfig.icon}
          </div>
          <div style={{ overflow: "hidden" }}>
            <h3
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 600,
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 190,
              }}
              title={recording.title}
            >
              {recording.title}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
              <span
                style={{
                  color: typeConfig.color,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {typeConfig.label}
              </span>
              <span style={{ color: "#475569", fontSize: 11 }}>•</span>
              <span style={{ color: "#94A3B8", fontSize: 12 }}>
                {formatDate(recording.recordedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Favorite & More Actions Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, position: "relative" }}>
          <button
            type="button"
            onClick={() => onToggleFavorite(recording.id)}
            title={recording.favorite ? "Unmark Favorite" : "Mark as Favorite"}
            style={{
              background: "none",
              border: "none",
              color: recording.favorite ? "#EF4444" : "#64748B",
              cursor: "pointer",
              padding: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <FiHeart
              style={{
                fontSize: 18,
                fill: recording.favorite ? "#EF4444" : "none",
                strokeWidth: 2,
              }}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: "none",
              border: "none",
              color: "#94A3B8",
              cursor: "pointer",
              padding: 6,
              borderRadius: 6,
            }}
          >
            <FiMoreVertical style={{ fontSize: 18 }} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: 34,
                right: 0,
                background: "#071B3A",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                padding: "6px 0",
                zIndex: 30,
                minWidth: 140,
              }}
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onViewDetails(recording);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
              >
                <FiInfo style={{ fontSize: 14 }} /> Details
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit(recording);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
              >
                <FiEdit2 style={{ fontSize: 14 }} /> Edit
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
              >
                <FiDownload style={{ fontSize: 14 }} /> {isDownloading ? "Downloading..." : "Download"}
              </button>

              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDelete(recording);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  background: "transparent",
                  border: "none",
                  color: "#EF4444",
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <FiTrash2 style={{ fontSize: 14 }} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Integrated Audio Player */}
      <AudioPlayer
        src={streamUrl}
        recordingId={recording.id}
        title={recording.title}
        initialDuration={recording.duration}
        activePlayerId={activePlayerId}
        onPlay={onPlay}
        accentColor={typeConfig.color}
      />

      {/* Description / Notes */}
      {recording.description && (
        <p
          style={{
            color: "#94A3B8",
            fontSize: 13,
            lineHeight: 1.4,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontStyle: "italic",
          }}
        >
          "{recording.description}"
        </p>
      )}

      {/* Badges Footer Row */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
        {recording.status && recording.status !== "COMPLETED" && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 6,
              background: recording.status === "IDEA" ? "rgba(234,179,8,0.2)" : "rgba(59,130,246,0.2)",
              color: recording.status === "IDEA" ? "#FBBF24" : "#60A5FA",
              border: `1px solid ${recording.status === "IDEA" ? "rgba(234,179,8,0.4)" : "rgba(59,130,246,0.4)"}`,
            }}
          >
            {recording.status === "IDEA" ? "💡 IDEA" : "⚡ IN PROGRESS"}
          </span>
        )}

        {recording.practiceMinutes > 0 && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 6,
              background: "rgba(16,185,129,0.15)",
              color: "#34D399",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <FiClock style={{ fontSize: 10 }} />
            {recording.practiceMinutes} min practice
          </span>
        )}

        {recording.projectName && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 6,
              background: "rgba(139,92,246,0.15)",
              color: "#A78BFA",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <FiFolder style={{ fontSize: 10 }} />
            {recording.projectName}
          </span>
        )}
      </div>
    </div>
  );
}
