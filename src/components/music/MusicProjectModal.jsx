import React, { useState, useEffect } from "react";
import { FiX, FiFolder, FiAlertCircle } from "react-icons/fi";
import { createProject, updateProject } from "../../services/musicApi";

export default function MusicProjectModal({
  isOpen,
  onClose,
  onSuccess,
  editingProject = null,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("IN_PROGRESS");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name || "");
      setDescription(editingProject.description || "");
      setStatus(editingProject.status || "IN_PROGRESS");
    } else {
      setName("");
      setDescription("");
      setStatus("IN_PROGRESS");
    }
    setError("");
  }, [editingProject, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a project name.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      if (editingProject) {
        await updateProject(editingProject.id, { name: name.trim(), description, status });
      } else {
        await createProject({ name: name.trim(), description, status });
      }
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Project save error:", err);
      setLoading(false);
      setError(err.response?.data?.message || err.message || "Failed to save project.");
    }
  };

  if (!isOpen) return null;

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
          maxWidth: 480,
          boxShadow: "0 20px 40px rgba(0,0,0,0.7)",
          padding: "24px",
          color: "#FFFFFF",
          fontFamily: "'Inter', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(139,92,246,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#A78BFA",
              }}
            >
              <FiFolder style={{ fontSize: 18 }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
              {editingProject ? "Edit Music Project" : "New Music Project"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#94A3B8",
              cursor: "pointer",
            }}
          >
            <FiX style={{ fontSize: 20 }} />
          </button>
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 8,
              color: "#FCA5A5",
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#CBD5E1", marginBottom: 6 }}>
              Project Name <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. My First Original Song, Debut EP Demo..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "rgba(11, 26, 48, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 10,
                color: "#FFFFFF",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#CBD5E1", marginBottom: 6 }}>
              Project Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "rgba(11, 26, 48, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 10,
                color: "#FFFFFF",
                fontSize: 14,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="IDEA" style={{ background: "#071B3A" }}>💡 Brainstorming / Idea</option>
              <option value="IN_PROGRESS" style={{ background: "#071B3A" }}>⚡ In Progress</option>
              <option value="COMPLETED" style={{ background: "#071B3A" }}>✅ Completed Composition</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#CBD5E1", marginBottom: 6 }}>
              Project Description
            </label>
            <textarea
              rows={3}
              placeholder="Description of the song, arrangement notes, or album plan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "rgba(11, 26, 48, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 10,
                color: "#FFFFFF",
                fontSize: 14,
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 8,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 14,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 16px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                color: "#94A3B8",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "9px 20px",
                background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
                border: "none",
                borderRadius: 8,
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
