import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiPlus,
  FiCheck,
  FiAlertTriangle,
  FiMessageSquare,
  FiArrowRight,
  FiLayers,
  FiZap,
} from "react-icons/fi";
import {
  addMilestone,
  toggleMilestone,
  deleteMilestone,
  addProgressUpdate,
  deleteProgressUpdate,
  updateGoalProgress,
  markGoalCompleted,
} from "../../services/goalService";

const CATEGORY_MAP = {
  PERSONAL: { icon: "🌱", label: "Personal" },
  HEALTH: { icon: "❤️", label: "Health" },
  FITNESS: { icon: "💪", label: "Fitness" },
  EDUCATION: { icon: "📚", label: "Education" },
  CAREER: { icon: "💼", label: "Career" },
  TRAVEL: { icon: "✈️", label: "Travel" },
  HOBBY: { icon: "🎨", label: "Hobby" },
  FINANCE: { icon: "💰", label: "Finance" },
  RELATIONSHIP: { icon: "🤝", label: "Relationship" },
  OTHER: { icon: "✨", label: "Other" },
};

const STATUS_MAP = {
  NOT_STARTED: { label: "Not Started", badge: "📝 Not Started", bg: "#F1F5F9", color: "#475569" },
  IN_PROGRESS: { label: "In Progress", badge: "🔵 In Progress", bg: "#EFF6FF", color: "#2563EB" },
  PAUSED: { label: "Paused", badge: "⏸️ Paused", bg: "#FFFBEB", color: "#D97706" },
  COMPLETED: { label: "Completed", badge: "✅ Completed", bg: "#ECFDF5", color: "#059669" },
  ABANDONED: { label: "Abandoned", badge: "❌ Abandoned", bg: "#FEF2F2", color: "#DC2626" },
};

const PRIORITY_MAP = {
  HIGH: { label: "High", bg: "#FEE2E2", color: "#EF4444" },
  MEDIUM: { label: "Medium", bg: "#FEF3C7", color: "#D97706" },
  LOW: { label: "Low", bg: "#E0F2FE", color: "#0284C7" },
};

export function getRemainingDaysText(goal) {
  if (goal.status === "COMPLETED") {
    const d = goal.completedAt ? new Date(goal.completedAt) : new Date(goal.updatedAt);
    return `Completed on ${d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`;
  }
  if (!goal.targetDate) {
    return "Open-ended goal";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(goal.targetDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) return `${diffDays} days remaining`;
  if (diffDays === 1) return "1 day remaining";
  if (diffDays === 0) return "Due today";
  return `Overdue (${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} ago)`;
}

export default function GoalDetailModal({
  isOpen,
  onClose,
  goal,
  onGoalUpdated,
  onEdit,
  onDelete,
  onGoalCompletedCelebration,
}) {
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [addingMilestone, setAddingMilestone] = useState(false);

  const [newUpdateNote, setNewUpdateNote] = useState("");
  const [addingUpdate, setAddingUpdate] = useState(false);

  const [sliderProgress, setSliderProgress] = useState(goal?.progressPercentage || 0);

  // Sync slider when goal changes
  React.useEffect(() => {
    if (goal) {
      setSliderProgress(goal.progressPercentage || 0);
    }
  }, [goal]);

  if (!isOpen || !goal) return null;

  const categoryMeta = CATEGORY_MAP[goal.category] || { icon: "🎯", label: goal.category };
  const statusMeta = STATUS_MAP[goal.status] || { label: goal.status, bg: "#F1F5F9", color: "#475569" };
  const priorityMeta = PRIORITY_MAP[goal.priority] || { label: goal.priority, bg: "#F1F5F9", color: "#475569" };
  const isLongTerm = goal.goalType === "LONG_TERM";

  const milestones = goal.milestones || [];
  const completedMilestones = milestones.filter((m) => m.completed).length;
  const milestoneProgress =
    milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  const updates = goal.updates || [];

  // Handle Progress Update
  const handleProgressChange = async (newVal) => {
    setSliderProgress(newVal);
    try {
      const res = await updateGoalProgress(goal.id, newVal);
      onGoalUpdated(res.data);
      if (newVal === 100 && goal.status !== "COMPLETED") {
        onGoalCompletedCelebration(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Manual Complete
  const handleMarkComplete = async () => {
    try {
      const res = await markGoalCompleted(goal.id);
      onGoalUpdated(res.data);
      onGoalCompletedCelebration(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Milestone Actions
  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    setAddingMilestone(true);
    try {
      await addMilestone(goal.id, { title: newMilestoneTitle.trim() });
      setNewMilestoneTitle("");
      // Refresh goal data
      const updated = {
        ...goal,
        milestones: [
          ...milestones,
          { id: Date.now(), title: newMilestoneTitle.trim(), completed: false },
        ],
      };
      onGoalUpdated(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingMilestone(false);
    }
  };

  const handleToggleMilestone = async (milestoneId) => {
    try {
      const res = await toggleMilestone(goal.id, milestoneId);
      const updatedMilestones = milestones.map((m) =>
        m.id === milestoneId ? res.data : m
      );
      onGoalUpdated({ ...goal, milestones: updatedMilestones });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    try {
      await deleteMilestone(goal.id, milestoneId);
      const updatedMilestones = milestones.filter((m) => m.id !== milestoneId);
      onGoalUpdated({ ...goal, milestones: updatedMilestones });
    } catch (err) {
      console.error(err);
    }
  };

  // Progress Update / Journal Actions
  const handleAddUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdateNote.trim()) return;
    setAddingUpdate(true);
    try {
      const res = await addProgressUpdate(goal.id, { note: newUpdateNote.trim() });
      setNewUpdateNote("");
      onGoalUpdated({
        ...goal,
        updates: [res.data, ...updates],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAddingUpdate(false);
    }
  };

  const handleDeleteUpdate = async (updateId) => {
    try {
      await deleteProgressUpdate(goal.id, updateId);
      const updatedUpdates = updates.filter((u) => u.id !== updateId);
      onGoalUpdated({ ...goal, updates: updatedUpdates });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          padding: 20,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            maxWidth: 780,
            width: "100%",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid #E2E8F0",
            overflow: "hidden",
            fontFamily: "'Inter', 'Manrope', sans-serif",
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              padding: "24px 28px",
              background: isLongTerm
                ? "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)"
                : "linear-gradient(135deg, #064E3B 0%, #065F46 100%)",
              color: "#FFFFFF",
              position: "relative",
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                borderRadius: "50%",
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#FFFFFF",
                backdropFilter: "blur(4px)",
              }}
            >
              <FiX style={{ fontSize: 18 }} />
            </button>

            {/* Badges row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: isLongTerm ? "#4338CA" : "#059669",
                  color: "#FFFFFF",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {isLongTerm ? <FiLayers /> : <FiZap />}
                {isLongTerm ? "Long-Term Roadmap" : "Short-Term Sprint"}
              </span>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#FFFFFF",
                }}
              >
                {categoryMeta.icon} {categoryMeta.label}
              </span>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: priorityMeta.bg,
                  color: priorityMeta.color,
                }}
              >
                {priorityMeta.label} Priority
              </span>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: statusMeta.bg,
                  color: statusMeta.color,
                }}
              >
                {statusMeta.badge}
              </span>
            </div>

            {/* Goal Title */}
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#FFFFFF",
                margin: "0 0 8px",
                lineHeight: 1.3,
              }}
            >
              {categoryMeta.icon} {goal.title}
            </h2>

            {/* Sub-info: Target date and remaining days */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "rgba(255, 255, 255, 0.85)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FiCalendar />
                <span>
                  {goal.targetDate
                    ? `Target: ${new Date(goal.targetDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}`
                    : "No fixed deadline"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FiClock />
                <span style={{ fontWeight: 600, color: "#FDE047" }}>
                  {getRemainingDaysText(goal)}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div
            style={{
              padding: "24px 28px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* Description */}
            {goal.description && (
              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 14,
                  padding: "16px 20px",
                }}
              >
                <h4 style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Goal Intent & Purpose
                </h4>
                <p style={{ margin: 0, fontSize: 14, color: "#334155", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {goal.description}
                </p>
              </div>
            )}

            {/* Interactive Progress Section */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 16,
                padding: "20px 22px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                    Current Progress
                  </h4>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748B" }}>
                    Move slider or click step buttons to adjust completion
                  </p>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#10B981" }}>
                  {sliderProgress}%
                </div>
              </div>

              {/* Progress bar visual */}
              <div
                style={{
                  width: "100%",
                  height: 12,
                  background: "#E2E8F0",
                  borderRadius: 6,
                  overflow: "hidden",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: `${sliderProgress}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #3B82F6 0%, #10B981 100%)",
                    borderRadius: 6,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={sliderProgress}
                onChange={(e) => handleProgressChange(parseInt(e.target.value, 10))}
                style={{ width: "100%", cursor: "pointer", marginBottom: 12 }}
              />

              {/* Quick Stepper Buttons: 0 -> 25 -> 50 -> 75 -> 100 */}
              <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
                {[0, 25, 50, 75, 100].map((step) => (
                  <button
                    key={step}
                    onClick={() => handleProgressChange(step)}
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      borderRadius: 8,
                      border: sliderProgress === step ? "1px solid #10B981" : "1px solid #E2E8F0",
                      background: sliderProgress === step ? "#ECFDF5" : "#F8FAFC",
                      color: sliderProgress === step ? "#059669" : "#475569",
                      fontSize: 12,
                      fontWeight: sliderProgress === step ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {step}%
                  </button>
                ))}
              </div>

              {/* Mark Completed Button if not yet 100% */}
              {goal.status !== "COMPLETED" && (
                <button
                  onClick={handleMarkComplete}
                  style={{
                    width: "100%",
                    marginTop: 14,
                    padding: "9px 16px",
                    borderRadius: 10,
                    border: "1px solid #BBF7D0",
                    background: "#F0FDF4",
                    color: "#15803D",
                    fontWeight: 600,
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <FiCheckCircle style={{ fontSize: 16 }} />
                  <span>Mark Goal Completed (100%)</span>
                </button>
              )}
            </div>

            {/* Milestones Support (especially for long-term goals) */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 16,
                padding: "20px 22px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                    Roadmap Milestones
                  </h4>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748B" }}>
                    {milestones.length > 0
                      ? `${completedMilestones} / ${milestones.length} milestones completed (${milestoneProgress}%)`
                      : "Break this big goal down into bite-sized milestones"}
                  </p>
                </div>
                {milestones.length > 0 && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: completedMilestones === milestones.length ? "#10B981" : "#3B82F6",
                    }}
                  >
                    {milestoneProgress}%
                  </span>
                )}
              </div>

              {/* Milestones List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: m.completed ? "#F0FDF4" : "#F8FAFC",
                      border: m.completed ? "1px solid #DCFCE7" : "1px solid #E2E8F0",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        cursor: "pointer",
                        flex: 1,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={m.completed}
                        onChange={() => handleToggleMilestone(m.id)}
                        style={{
                          width: 17,
                          height: 17,
                          accentColor: "#10B981",
                          cursor: "pointer",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 14,
                          color: m.completed ? "#64748B" : "#1E293B",
                          textDecoration: m.completed ? "line-through" : "none",
                          fontWeight: m.completed ? 400 : 500,
                        }}
                      >
                        {m.title}
                      </span>
                    </label>

                    <button
                      onClick={() => handleDeleteMilestone(m.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#94A3B8",
                        cursor: "pointer",
                        padding: 4,
                      }}
                      title="Delete milestone"
                    >
                      <FiTrash2 style={{ fontSize: 14 }} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add milestone form */}
              <form onSubmit={handleAddMilestone} style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  placeholder="Add a milestone (e.g. Decide dates, book tickets)..."
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid #CBD5E1",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={addingMilestone || !newMilestoneTitle.trim()}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "#3B82F6",
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: addingMilestone ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <FiPlus /> Add
                </button>
              </form>
            </div>

            {/* Progress Updates / Journal Timeline */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 16,
                padding: "20px 22px",
              }}
            >
              <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                Progress Journal & Timeline
              </h4>
              <p style={{ margin: "0 0 14px", fontSize: 12, color: "#64748B" }}>
                Log thoughts, breakthroughs, and status notes along your journey
              </p>

              {/* Add Update Note Form */}
              <form onSubmit={handleAddUpdate} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input
                  type="text"
                  placeholder="Record an update (e.g. Selected location, completed 20km today)..."
                  value={newUpdateNote}
                  onChange={(e) => setNewUpdateNote(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid #CBD5E1",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={addingUpdate || !newUpdateNote.trim()}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "#10B981",
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: addingUpdate ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <FiMessageSquare /> Post
                </button>
              </form>

              {/* Timeline Items */}
              {updates.length === 0 ? (
                <p style={{ fontSize: 13, color: "#94A3B8", fontStyle: "italic", margin: 0 }}>
                  No progress updates recorded yet. Add your first note above!
                </p>
              ) : (
                <div style={{ position: "relative", paddingLeft: 18, borderLeft: "2px solid #E2E8F0", display: "flex", flexDirection: "column", gap: 16 }}>
                  {updates.map((up) => {
                    const dateStr = up.createdAt
                      ? new Date(up.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                        })
                      : "Recent";
                    return (
                      <div key={up.id} style={{ position: "relative" }}>
                        {/* Dot on timeline */}
                        <div
                          style={{
                            position: "absolute",
                            left: -24,
                            top: 4,
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#3B82F6",
                            border: "2px solid #FFFFFF",
                            boxShadow: "0 0 0 1px #93C5FD",
                          }}
                        />

                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                          <div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", display: "block", marginBottom: 2 }}>
                              {dateStr}
                            </span>
                            <p style={{ margin: 0, fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
                              "{up.note}"
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteUpdate(up.id)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#94A3B8",
                              cursor: "pointer",
                              padding: 2,
                            }}
                            title="Delete note"
                          >
                            <FiTrash2 style={{ fontSize: 13 }} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Metadata Footer info */}
            <div style={{ fontSize: 12, color: "#94A3B8", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <span>Created: {new Date(goal.createdAt).toLocaleDateString()}</span>
              {goal.completedAt && (
                <span style={{ color: "#059669", fontWeight: 600 }}>
                  Completed: {new Date(goal.completedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div
            style={{
              padding: "16px 28px",
              borderTop: "1px solid #E2E8F0",
              background: "#F8FAFC",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => onDelete(goal.id)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #FECACA",
                background: "#FEF2F2",
                color: "#DC2626",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <FiTrash2 /> Delete Goal
            </button>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => onEdit(goal)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  color: "#334155",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FiEdit2 /> Edit Goal
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: "none",
                  background: "#0F172A",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
