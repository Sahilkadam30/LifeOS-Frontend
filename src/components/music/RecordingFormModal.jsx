import React, { useState, useEffect, useRef } from "react";
import {
  FiX,
  FiUploadCloud,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiCalendar,
  FiHeart,
  FiClock,
  FiFolder,
} from "react-icons/fi";
import { uploadRecording, updateRecording } from "../../services/musicApi";
import { RECORDING_TYPE_INFO } from "./RecordingCard";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function RecordingFormModal({
  isOpen,
  onClose,
  onSuccess,
  projects = [],
  editingRecording = null,
}) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recordingType, setRecordingType] = useState("SONG");
  const [recordedAt, setRecordedAt] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [favorite, setFavorite] = useState(false);
  const [status, setStatus] = useState("COMPLETED");
  const [practiceMinutes, setPracticeMinutes] = useState("");
  const [practiceNotes, setPracticeNotes] = useState("");
  const [projectId, setProjectId] = useState("");
  const [detectedDuration, setDetectedDuration] = useState(0);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (editingRecording) {
      setTitle(editingRecording.title || "");
      setDescription(editingRecording.description || "");
      setRecordingType(editingRecording.recordingType || "SONG");
      setRecordedAt(
        editingRecording.recordedAt
          ? editingRecording.recordedAt.slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setFavorite(editingRecording.favorite || false);
      setStatus(editingRecording.status || "COMPLETED");
      setPracticeMinutes(editingRecording.practiceMinutes ? String(editingRecording.practiceMinutes) : "");
      setPracticeNotes(editingRecording.practiceNotes || "");
      setProjectId(editingRecording.projectId ? String(editingRecording.projectId) : "");
      setDetectedDuration(editingRecording.duration || 0);
      setFile(null);
    } else {
      resetForm();
    }
  }, [editingRecording, isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRecordingType("SONG");
    setRecordedAt(new Date().toISOString().slice(0, 10));
    setFavorite(false);
    setStatus("COMPLETED");
    setPracticeMinutes("");
    setPracticeNotes("");
    setProjectId("");
    setFile(null);
    setDetectedDuration(0);
    setUploadProgress(0);
    setIsUploading(false);
    setErrorMessage("");
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setErrorMessage("Audio file exceeds the maximum limit of 50 MB.");
      return;
    }

    setErrorMessage("");
    setFile(selectedFile);

    // If title is empty, prefill from filename
    if (!title) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }

    // Attempt duration detection via HTML Audio
    try {
      const objectUrl = URL.createObjectURL(selectedFile);
      const tempAudio = new Audio(objectUrl);
      tempAudio.addEventListener("loadedmetadata", () => {
        if (tempAudio.duration && !isNaN(tempAudio.duration)) {
          setDetectedDuration(tempAudio.duration);
        }
        URL.revokeObjectURL(objectUrl);
      });
    } catch (e) {
      console.warn("Could not calculate duration client-side:", e);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Please enter a title for this recording.");
      return;
    }

    if (!editingRecording && !file) {
      setErrorMessage("Please select or drop an audio file.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (editingRecording) {
        // Update metadata
        const updateData = {
          title: title.trim(),
          description,
          recordingType,
          recordedAt: recordedAt + "T12:00:00",
          duration: detectedDuration,
          favorite,
          status,
          practiceNotes,
          practiceMinutes: practiceMinutes ? parseInt(practiceMinutes, 10) : null,
          projectId: projectId ? parseInt(projectId, 10) : null,
        };
        await updateRecording(editingRecording.id, updateData);
        setIsUploading(false);
        onSuccess();
        onClose();
      } else {
        // Upload new recording
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title.trim());
        formData.append("description", description);
        formData.append("recordingType", recordingType);
        formData.append("recordedAt", recordedAt + "T12:00:00");
        formData.append("duration", detectedDuration || 0);
        formData.append("favorite", favorite);
        formData.append("status", status);
        if (practiceNotes) formData.append("practiceNotes", practiceNotes);
        if (practiceMinutes) formData.append("practiceMinutes", practiceMinutes);
        if (projectId) formData.append("projectId", projectId);

        await uploadRecording(formData, (progress) => {
          setUploadProgress(progress);
        });

        setIsUploading(false);
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Save error:", err);
      setIsUploading(false);
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Failed to save recording. Please verify the file and try again."
      );
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
          maxWidth: 620,
          maxHeight: "92vh",
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
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: 14,
          }}
        >
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#fff" }}>
              {editingRecording ? "Edit Recording" : "Upload New Recording"}
            </h2>
            <p style={{ color: "#94A3B8", fontSize: 13, margin: "4px 0 0" }}>
              {editingRecording
                ? "Update your recording details and notes."
                : "Add singing, instrumental performances, practice sessions, or ideas."}
            </p>
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
              borderRadius: "50%",
            }}
          >
            <FiX style={{ fontSize: 22 }} />
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 10,
              color: "#FCA5A5",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            <FiAlertCircle style={{ fontSize: 18, flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* File Upload Zone (required for new, optional for edit) */}
          {!editingRecording && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#CBD5E1",
                  marginBottom: 6,
                }}
              >
                Audio File <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragActive ? "#10B981" : "rgba(255, 255, 255, 0.18)"}`,
                  borderRadius: 12,
                  padding: "24px 16px",
                  textAlign: "center",
                  background: dragActive ? "rgba(16, 185, 129, 0.08)" : "rgba(11, 26, 48, 0.5)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.aac,.flac"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
                <FiUploadCloud
                  style={{
                    fontSize: 36,
                    color: file ? "#10B981" : "#64748B",
                    marginBottom: 8,
                  }}
                />
                {file ? (
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: "#10B981" }}>
                      {file.name}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94A3B8" }}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                    </p>
                  </div>
                ) : (
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: "#E2E8F0" }}>
                      Drop your audio here, or <span style={{ color: "#3B82F6" }}>browse</span>
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B" }}>
                      Supports MP3, WAV, M4A, OGG, WEBM (Max 50MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#CBD5E1",
                marginBottom: 6,
              }}
            >
              Recording Title <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Perfect Evening Guitar, Summer Acoustic Demo..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          {/* Type & Date Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#CBD5E1",
                  marginBottom: 6,
                }}
              >
                Recording Type
              </label>
              <select
                value={recordingType}
                onChange={(e) => setRecordingType(e.target.value)}
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
                {Object.keys(RECORDING_TYPE_INFO).map((key) => (
                  <option key={key} value={key} style={{ background: "#071B3A" }}>
                    {RECORDING_TYPE_INFO[key].icon} {RECORDING_TYPE_INFO[key].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#CBD5E1",
                  marginBottom: 6,
                }}
              >
                Recorded Date
              </label>
              <input
                type="date"
                value={recordedAt}
                onChange={(e) => setRecordedAt(e.target.value)}
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
          </div>

          {/* Project & Idea Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#CBD5E1",
                  marginBottom: 6,
                }}
              >
                Project (Optional)
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
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
                <option value="" style={{ background: "#071B3A" }}>-- No Project --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id} style={{ background: "#071B3A" }}>
                    📁 {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#CBD5E1",
                  marginBottom: 6,
                }}
              >
                Status
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
                <option value="IDEA" style={{ background: "#071B3A" }}>💡 Rough Idea</option>
                <option value="IN_PROGRESS" style={{ background: "#071B3A" }}>⚡ Work in Progress</option>
                <option value="COMPLETED" style={{ background: "#071B3A" }}>✅ Completed / Polished</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#CBD5E1",
                marginBottom: 6,
              }}
            >
              Description & Inspiration
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Practiced intro and fingerpicking technique on chord transition..."
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

          {/* Practice Session specific notes & duration */}
          {(recordingType === "PRACTICE" || practiceMinutes) && (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                borderRadius: 12,
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#34D399", fontWeight: 600 }}>
                <FiClock /> Practice Tracker Info
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>
                    Practice Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="45"
                    value={practiceMinutes}
                    onChange={(e) => setPracticeMinutes(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "rgba(11, 26, 48, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: 8,
                      color: "#FFFFFF",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>
                    Exercises / Chords Practiced
                  </label>
                  <input
                    type="text"
                    placeholder="Scale exercises, metronome 110bpm..."
                    value={practiceNotes}
                    onChange={(e) => setPracticeNotes(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "rgba(11, 26, 48, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: 8,
                      color: "#FFFFFF",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Favorite Checkbox */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              id="favoriteCheckbox"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              style={{
                width: 18,
                height: 18,
                accentColor: "#EF4444",
                cursor: "pointer",
              }}
            />
            <label
              htmlFor="favoriteCheckbox"
              style={{
                fontSize: 14,
                color: "#E2E8F0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>❤️ Mark as Favorite Recording</span>
            </label>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div style={{ marginTop: 6 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "#94A3B8",
                  marginBottom: 6,
                }}
              >
                <span>Uploading audio...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div
                style={{
                  height: 8,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${uploadProgress}%`,
                    background: "linear-gradient(90deg, #10B981, #3B82F6)",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
            </div>
          )}

          {/* Footer Submit Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 10,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 16,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              style={{
                padding: "10px 18px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 10,
                color: "#94A3B8",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              style={{
                padding: "10px 22px",
                background: "linear-gradient(135deg, #10B981, #2563EB)",
                border: "none",
                borderRadius: 10,
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 600,
                cursor: isUploading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
              }}
            >
              {isUploading
                ? `Saving (${uploadProgress}%)`
                : editingRecording
                ? "Update Recording"
                : "Upload Recording"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
