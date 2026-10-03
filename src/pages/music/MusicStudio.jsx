import React, { useState, useEffect, useCallback } from "react";
import {
  FiMusic,
  FiPlus,
  FiFolder,
  FiHeart,
  FiUploadCloud,
  FiRefreshCw,
} from "react-icons/fi";
import MusicSidebar from "../../components/music/MusicSidebar";
import MusicStats from "../../components/music/MusicStats";
import RecordingFilters from "../../components/music/RecordingFilters";
import RecordingCard from "../../components/music/RecordingCard";
import RecordingFormModal from "../../components/music/RecordingFormModal";
import RecordingDetailsModal from "../../components/music/RecordingDetailsModal";
import MusicProjectModal from "../../components/music/MusicProjectModal";
import MusicProjectCard from "../../components/music/MusicProjectCard";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import {
  getRecordings,
  getMusicStats,
  getProjects,
  toggleFavoriteRecording,
  deleteRecording,
  deleteProject,
} from "../../services/musicApi";

export default function MusicStudio() {
  const [recordings, setRecordings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [activeSidebarFilter, setActiveSidebarFilter] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Audio Playback Coordination
  const [activePlayerId, setActivePlayerId] = useState(null);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingRecording, setEditingRecording] = useState(null);
  const [viewingRecording, setViewingRecording] = useState(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'recording' | 'project', item: object }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [recData, statsData, projData] = await Promise.all([
        getRecordings({
          type:
            selectedCategory !== "ALL" && selectedCategory !== "INSTRUMENTS"
              ? selectedCategory
              : undefined,
          favorite: showFavoritesOnly ? true : undefined,
          projectId: selectedProjectId || undefined,
          search: searchQuery || undefined,
          sort: sortBy,
        }),
        getMusicStats(),
        getProjects(),
      ]);

      setRecordings(recData || []);
      setStats(statsData || null);
      setProjects(projData || []);
    } catch (err) {
      console.error("Failed to load music data:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, showFavoritesOnly, selectedProjectId, searchQuery, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sync sidebar click to filters
  const handleSidebarFilter = (filterId) => {
    setActiveSidebarFilter(filterId);
    setSelectedProjectId(null);

    if (filterId === "PROJECTS") {
      // Show projects view
      setSelectedCategory("ALL");
    } else if (filterId === "INSTRUMENTS") {
      setSelectedCategory("OTHER_INSTRUMENT");
    } else {
      setSelectedCategory(filterId);
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const updated = await toggleFavoriteRecording(id);
      setRecordings((prev) =>
        prev.map((r) => (r.id === id ? { ...r, favorite: updated.favorite } : r))
      );
      if (viewingRecording && viewingRecording.id === id) {
        setViewingRecording((prev) => ({ ...prev, favorite: updated.favorite }));
      }
      // Refresh stats
      const newStats = await getMusicStats();
      setStats(newStats);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "recording") {
        await deleteRecording(deleteTarget.item.id);
        if (viewingRecording?.id === deleteTarget.item.id) {
          setViewingRecording(null);
        }
      } else if (deleteTarget.type === "project") {
        await deleteProject(deleteTarget.item.id);
        if (selectedProjectId === deleteTarget.item.id) {
          setSelectedProjectId(null);
        }
      }
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handlePlayRecording = (recordingId) => {
    setActivePlayerId(recordingId);
  };

  // Determine recordings to show
  let displayedRecordings = recordings;
  if (activeSidebarFilter === "INSTRUMENTS") {
    displayedRecordings = displayedRecordings.filter((r) =>
      ["GUITAR", "PIANO", "KEYBOARD", "DRUMS", "FLUTE", "VIOLIN", "OTHER_INSTRUMENT"].includes(
        r.recordingType
      )
    );
  }

  const isProjectsView = activeSidebarFilter === "PROJECTS" && !selectedProjectId;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#FFFFFF",
        color: "#1E293B",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* 🎵 Music Sidebar */}
      <MusicSidebar
        activeFilter={activeSidebarFilter}
        setActiveFilter={handleSidebarFilter}
        onOpenUpload={() => {
          setEditingRecording(null);
          setIsUploadModalOpen(true);
        }}
        onOpenNewProject={() => {
          setEditingProject(null);
          setIsProjectModalOpen(true);
        }}
        stats={stats}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={(val) => {
          setShowFavoritesOnly(val);
          if (val) setActiveSidebarFilter("ALL");
        }}
      />

      {/* Main Studio Workspace */}
      <main
        style={{
          flex: 1,
          padding: "28px 36px",
          overflowY: "auto",
          maxWidth: 1400,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>🎵</span>
              <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.5px", color: "#0F172A" }}>
                Music Studio
              </h1>
            </div>
            <p style={{ color: "#64748B", fontSize: 14, margin: "4px 0 0" }}>
              "Create. Record. Practice. Remember." — Your personal music library and recording journal.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {selectedProjectId && (
              <button
                type="button"
                onClick={() => setSelectedProjectId(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(139,92,246,0.3)",
                  background: "rgba(139,92,246,0.15)",
                  color: "#C4B5FD",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <FiFolder /> Back to All Tracks
              </button>
            )}

            <button
              type="button"
              onClick={fetchData}
              title="Refresh"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                background: "#F8FAFC",
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <FiRefreshCw style={{ fontSize: 16 }} />
            </button>

            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("open-lifeos-chat", {
                    detail: {
                      message: "Give me a summary of my music library, practice time, and project status.",
                    },
                  })
                );
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid rgba(139,92,246,0.4)",
                background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))",
                color: "#7C3AED",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))";
              }}
            >
              <span style={{ fontSize: 16 }}>✨</span>
              <span>Ask Music AI</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingRecording(null);
                setIsUploadModalOpen(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #10B981, #2563EB)",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
              }}
            >
              <FiPlus style={{ fontSize: 18, strokeWidth: 2.5 }} />
              <span>Upload Recording</span>
            </button>
          </div>
        </div>

        {/* Studio Summary Statistics */}
        <MusicStats stats={stats} />

        {/* AI Studio Assistant Quick Prompts */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: "10px 16px",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🤖</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
              Studio AI (RAG):
            </span>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              Ask questions about your tracks, practice, or ideas:
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            {[
              { label: "⏱️ Practice Stats", prompt: "How much did I practice this week and what are my practice habits?" },
              { label: "💡 Song Ideas", prompt: "What are my unfinished song ideas and music projects?" },
              { label: "🎸 Instruments", prompt: "Summarize my instrument recordings and recommendations." },
              { label: "✨ Production Advice", prompt: "Based on my recorded tracks and notes, what should I focus on next?" },
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("open-lifeos-chat", {
                      detail: { message: item.prompt, autoSend: true },
                    })
                  );
                }}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #CBD5E1",
                  borderRadius: 20,
                  padding: "5px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#334155",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#8B5CF6";
                  e.currentTarget.style.color = "#7C3AED";
                  e.currentTarget.style.background = "#F5F3FF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#CBD5E1";
                  e.currentTarget.style.color = "#334155";
                  e.currentTarget.style.background = "#FFFFFF";
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Project Banner */}
        {selectedProjectId && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))",
              border: "1px solid rgba(139,92,246,0.35)",
              borderRadius: 12,
              padding: "14px 20px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FiFolder style={{ color: "#A78BFA", fontSize: 20 }} />
              <div>
                <span style={{ fontSize: 12, color: "#C4B5FD", fontWeight: 600, textTransform: "uppercase" }}>
                  Active Project
                </span>
                <h3 style={{ margin: 0, fontSize: 16, color: "#fff" }}>
                  {projects.find((p) => p.id === selectedProjectId)?.name || "Project View"}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedProjectId(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94A3B8",
                fontSize: 13,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Show all recordings
            </button>
          </div>
        )}

        {/* If Projects view tab is clicked */}
        {isProjectsView ? (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#0F172A" }}>
                📁 Music Projects & Albums ({projects.length})
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setIsProjectModalOpen(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid rgba(139,92,246,0.4)",
                  background: "rgba(139,92,246,0.18)",
                  color: "#C4B5FD",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <FiPlus /> New Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  background: "#F8FAFC",
                  borderRadius: 16,
                  border: "1px dashed #CBD5E1",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px", color: "#0F172A" }}>
                  No Music Projects Yet
                </h3>
                <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 20px" }}>
                  Group your songs, vocal tracks, acoustic demos, and final mixes into albums or EP projects.
                </p>
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(true)}
                  style={{
                    padding: "10px 20px",
                    background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
                    border: "none",
                    borderRadius: 10,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: 20,
                }}
              >
                {projects.map((proj) => (
                  <MusicProjectCard
                    key={proj.id}
                    project={proj}
                    onSelectProject={(p) => setSelectedProjectId(p.id)}
                    onEdit={(p) => {
                      setEditingProject(p);
                      setIsProjectModalOpen(true);
                    }}
                    onDelete={(p) =>
                      setDeleteTarget({
                        type: "project",
                        item: p,
                        title: p.name,
                      })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Normal Recordings View */
          <div>
            {/* Filters Bar */}
            <RecordingFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              showFavoritesOnly={showFavoritesOnly}
              setShowFavoritesOnly={setShowFavoritesOnly}
              totalResults={displayedRecordings.length}
            />

            {/* Empty States */}
            {displayedRecordings.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "70px 20px",
                  background: "#F8FAFC",
                  borderRadius: 18,
                  border: "1px dashed #CBD5E1",
                  marginTop: 10,
                }}
              >
                {showFavoritesOnly ? (
                  <div>
                    <div style={{ fontSize: 50, marginBottom: 12 }}>❤️</div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "#0F172A" }}>
                      No favorite recordings yet.
                    </h3>
                    <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 20px" }}>
                      Click the heart icon on any recording to pin it to your favorites.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowFavoritesOnly(false)}
                      style={{
                        padding: "9px 18px",
                        background: "#F1F5F9",
                        border: "1px solid #CBD5E1",
                        borderRadius: 8,
                        color: "#334155",
                        cursor: "pointer",
                      }}
                    >
                      View All Recordings
                    </button>
                  </div>
                ) : selectedCategory === "MUSIC_IDEA" ? (
                  <div>
                    <div style={{ fontSize: 50, marginBottom: 12 }}>💡</div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "#0F172A" }}>
                      No music ideas yet.
                    </h3>
                    <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 20px" }}>
                      Hum a melody, capture a chord progression, or record a rough idea before it's forgotten.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRecording(null);
                        setIsUploadModalOpen(true);
                      }}
                      style={{
                        padding: "10px 22px",
                        background: "linear-gradient(135deg, #EAB308, #F59E0B)",
                        border: "none",
                        borderRadius: 10,
                        color: "#08162B",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Record A Music Idea
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 52, marginBottom: 12 }}>🎵</div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", color: "#0F172A" }}>
                      Your Music Studio is empty
                    </h3>
                    <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 24px" }}>
                      "Start saving your musical journey." Store songs, guitar demos, singing practice, or melodies.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRecording(null);
                        setIsUploadModalOpen(true);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "12px 24px",
                        background: "linear-gradient(135deg, #10B981, #2563EB)",
                        border: "none",
                        borderRadius: 12,
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 4px 18px rgba(16, 185, 129, 0.45)",
                      }}
                    >
                      <FiUploadCloud style={{ fontSize: 20 }} />
                      <span>Upload Your First Recording</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Recordings Grid: 3 cards desktop, 2 tablet, 1 mobile */
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: 22,
                }}
              >
                {displayedRecordings.map((recording) => (
                  <RecordingCard
                    key={recording.id}
                    recording={recording}
                    activePlayerId={activePlayerId}
                    onPlay={handlePlayRecording}
                    onToggleFavorite={handleToggleFavorite}
                    onEdit={(r) => {
                      setEditingRecording(r);
                      setIsUploadModalOpen(true);
                    }}
                    onDelete={(r) =>
                      setDeleteTarget({
                        type: "recording",
                        item: r,
                        title: r.title,
                      })
                    }
                    onViewDetails={(r) => setViewingRecording(r)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Upload & Edit Recording Modal */}
      <RecordingFormModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setEditingRecording(null);
        }}
        onSuccess={fetchData}
        projects={projects}
        editingRecording={editingRecording}
      />

      {/* Recording Details Modal */}
      <RecordingDetailsModal
        isOpen={!!viewingRecording}
        recording={viewingRecording}
        onClose={() => setViewingRecording(null)}
        onEdit={(r) => {
          setViewingRecording(null);
          setEditingRecording(r);
          setIsUploadModalOpen(true);
        }}
        onDelete={(r) => {
          setViewingRecording(null);
          setDeleteTarget({
            type: "recording",
            item: r,
            title: r.title,
          });
        }}
        onToggleFavorite={handleToggleFavorite}
        activePlayerId={activePlayerId}
        onPlay={handlePlayRecording}
      />

      {/* Music Project Create/Edit Modal */}
      <MusicProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSuccess={fetchData}
        editingProject={editingProject}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          open={!!deleteTarget}
          isOpen={!!deleteTarget}
          title={`Delete ${deleteTarget.type === "project" ? "Project" : "Recording"}?`}
          description={`Are you sure you want to delete "${deleteTarget.title}"? ${
            deleteTarget.type === "recording"
              ? "The audio file and metadata will be permanently removed."
              : "Recordings in this project will not be deleted."
          }`}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
