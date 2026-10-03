import React, { useState } from "react";
import {
  FiX,
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiHeart,
  FiCalendar,
  FiHardDrive,
  FiClock,
  FiFolder,
  FiFileText,
} from "react-icons/fi";
import AudioPlayer from "./AudioPlayer";
import { RECORDING_TYPE_INFO } from "./RecordingCard";
import { getStreamUrl, downloadRecordingFile } from "../../services/musicApi";

export default function RecordingDetailsModal({
  recording,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  activePlayerId,
  onPlay,
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !recording) return null;

  const typeConfig = RECORDING_TYPE_INFO[recording.recordingType] || RECORDING_TYPE_INFO.OTHER;
  const streamUrl = getStreamUrl(recording.id);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }
    return (bytes / 1024).toFixed(1) + " KB";
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
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
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#08162B",
          borderRadius: 18,
          border: "1px solid rgba(255, 255, 255, 0.12)",
          width: "100%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 40px rgba(0,0,0,0.7)",
          padding: "26px",
          position: "relative",
          color: "#FFFFFF",
          fontFamily: "'Inter', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 20,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: typeConfig.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                border: `1px solid ${typeConfig.color}40`,
              }}
            >
              {typeConfig.icon}
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#fff" }}>
                {recording.title}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span
                  style={{
                    color: typeConfig.color,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {typeConfig.label}
                </span>
                {recording.status && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 6,
                      background:
                        recording.status === "IDEA"
                          ? "rgba(234,179,8,0.2)"
                          : "rgba(16,185,129,0.2)",
                      color: recording.status === "IDEA" ? "#FBBF24" : "#34D399",
                    }}
                  >
                    {recording.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#94A3B8",
              cursor: "pointer",
              padding: 6,
            }}
          >
            <FiX style={{ fontSize: 22 }} />
          </button>
        </div>

        {/* Audio Player */}
        <div style={{ marginBottom: 20 }}>
          <AudioPlayer
            src={streamUrl}
            recordingId={recording.id}
            title={recording.title}
            initialDuration={recording.duration}
            activePlayerId={activePlayerId}
            onPlay={onPlay}
            accentColor={typeConfig.color}
          />
        </div>

        {/* Description & Practice Notes */}
        {recording.description && (
          <div
            style={{
              background: "rgba(11, 26, 48, 0.6)",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 16,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#64748B",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Description & Notes
            </div>
            <p style={{ color: "#E2E8F0", fontSize: 14, margin: 0, lineHeight: 1.5 }}>
              {recording.description}
            </p>
          </div>
        )}

        {recording.practiceNotes && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.08)",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 16,
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#34D399",
                textTransform: "uppercase",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <FiClock /> Practice Session Details
            </div>
            <p style={{ color: "#E2E8F0", fontSize: 14, margin: 0 }}>
              {recording.practiceNotes}
            </p>
            {recording.practiceMinutes > 0 && (
              <p style={{ color: "#94A3B8", fontSize: 12, margin: "6px 0 0" }}>
                Session duration: {recording.practiceMinutes} minutes
              </p>
            )}
          </div>
        )}

        {/* Metadata Details Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              background: "rgba(11, 26, 48, 0.5)",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ fontSize: 11, color: "#64748B", display: "block" }}>
              Recorded Date
            </span>
            <span style={{ fontSize: 13, color: "#E2E8F0", fontWeight: 500 }}>
              {formatDateTime(recording.recordedAt)}
            </span>
          </div>

          <div
            style={{
              background: "rgba(11, 26, 48, 0.5)",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ fontSize: 11, color: "#64748B", display: "block" }}>
              Uploaded Date
            </span>
            <span style={{ fontSize: 13, color: "#E2E8F0", fontWeight: 500 }}>
              {formatDateTime(recording.createdAt)}
            </span>
          </div>

          <div
            style={{
              background: "rgba(11, 26, 48, 0.5)",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ fontSize: 11, color: "#64748B", display: "block" }}>
              File Size
            </span>
            <span style={{ fontSize: 13, color: "#E2E8F0", fontWeight: 500 }}>
              {formatFileSize(recording.fileSize)}
            </span>
          </div>

          <div
            style={{
              background: "rgba(11, 26, 48, 0.5)",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ fontSize: 11, color: "#64748B", display: "block" }}>
              Audio Format
            </span>
            <span style={{ fontSize: 13, color: "#E2E8F0", fontWeight: 500 }}>
              {recording.mimeType || "audio/mpeg"}
            </span>
          </div>
        </div>

        {/* Actions Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              onClick={() => onToggleFavorite(recording.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: recording.favorite ? "rgba(239,68,68,0.15)" : "transparent",
                color: recording.favorite ? "#EF4444" : "#94A3B8",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <FiHeart style={{ fill: recording.favorite ? "#EF4444" : "none" }} />
              {recording.favorite ? "Favorited" : "Favorite"}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "transparent",
                color: "#94A3B8",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <FiDownload />
              {isDownloading ? "Downloading..." : "Download"}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(recording);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 10,
                border: "1px solid rgba(59,130,246,0.3)",
                background: "rgba(59,130,246,0.15)",
                color: "#60A5FA",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <FiEdit2 /> Edit
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(recording);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 10,
                border: "1px solid rgba(239,68,68,0.3)",
                background: "rgba(239,68,68,0.12)",
                color: "#EF4444",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
