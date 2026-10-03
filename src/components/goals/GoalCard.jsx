import React from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiEye,
  FiEdit2,
  FiLayers,
  FiZap,
  FiCheckSquare,
} from "react-icons/fi";
import { getRemainingDaysText } from "./GoalDetailModal";

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

export default function GoalCard({
  goal,
  onView,
  onEdit,
  onQuickProgress,
  onManualComplete,
}) {
  const isLongTerm = goal.goalType === "LONG_TERM";
  const categoryMeta = CATEGORY_MAP[goal.category] || { icon: "🎯", label: goal.category };
  const statusMeta = STATUS_MAP[goal.status] || { label: goal.status, bg: "#F1F5F9", color: "#475569" };
  const priorityMeta = PRIORITY_MAP[goal.priority] || { label: goal.priority, bg: "#F1F5F9", color: "#475569" };

  const milestones = goal.milestones || [];
  const completedMilestones = milestones.filter((m) => m.completed).length;
  const milestonePercent =
    milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  const remainingDays = getRemainingDaysText(goal);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 24px -6px rgba(0, 0, 0, 0.08)" }}
      transition={{ duration: 0.2 }}
      style={{
        background: "#FFFFFF",
        borderRadius: 20,
        border: goal.status === "COMPLETED" ? "1px solid #BBF7D0" : "1px solid #E2E8F0",
        padding: "22px 24px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Inter', 'Manrope', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Horizon Accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            goal.status === "COMPLETED"
              ? "linear-gradient(90deg, #10B981, #059669)"
              : isLongTerm
              ? "linear-gradient(90deg, #6366F1, #8B5CF6)"
              : "linear-gradient(90deg, #F59E0B, #EF4444)",
        }}
      />

      {/* Header row: Type badge, Category tag, Priority, Status */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Horizon Badge */}
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 6,
                background: isLongTerm ? "#EEF2FF" : "#FFFBEB",
                color: isLongTerm ? "#4F46E5" : "#D97706",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {isLongTerm ? <FiLayers style={{ fontSize: 11 }} /> : <FiZap style={{ fontSize: 11 }} />}
              {isLongTerm ? "Long Term" : "Short Term"}
            </span>

            {/* Category tag */}
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: 6,
                background: "#F1F5F9",
                color: "#475569",
              }}
            >
              {categoryMeta.icon} {categoryMeta.label}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Priority tag */}
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: 6,
                background: priorityMeta.bg,
                color: priorityMeta.color,
              }}
            >
              {priorityMeta.label}
            </span>

            {/* Status badge */}
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 12,
                background: statusMeta.bg,
                color: statusMeta.color,
              }}
            >
              {statusMeta.badge}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onView(goal)}
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#0F172A",
            margin: "0 0 8px",
            lineHeight: 1.35,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#0F172A")}
        >
          <span>{categoryMeta.icon}</span>
          <span style={{ flex: 1 }}>{goal.title}</span>
        </h3>

        {/* Description snippet */}
        {goal.description && (
          <p
            style={{
              fontSize: 13,
              color: "#64748B",
              margin: "0 0 14px",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {goal.description}
          </p>
        )}

        {/* Milestone Count if present */}
        {milestones.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#475569",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              padding: "6px 10px",
              borderRadius: 8,
              marginBottom: 14,
            }}
          >
            <FiCheckSquare style={{ color: "#10B981" }} />
            <span>
              <strong>{completedMilestones} / {milestones.length}</strong> milestones completed ({milestonePercent}%)
            </span>
          </div>
        )}

        {/* Progress bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#64748B" }}>
              Progress
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color: goal.progressPercentage === 100 ? "#059669" : "#2563EB" }}>
              {goal.progressPercentage}%
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: 8,
              background: "#E2E8F0",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${goal.progressPercentage}%`,
                height: "100%",
                background:
                  goal.progressPercentage === 100
                    ? "linear-gradient(90deg, #10B981, #059669)"
                    : "linear-gradient(90deg, #3B82F6 0%, #10B981 100%)",
                borderRadius: 4,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Target Date & Remaining days */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#64748B",
            marginBottom: 16,
            paddingTop: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <FiCalendar style={{ fontSize: 13 }} />
            <span>
              {goal.targetDate
                ? new Date(goal.targetDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "No target date"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <FiClock style={{ fontSize: 13 }} />
            <span
              style={{
                fontWeight: 600,
                color:
                  goal.status === "COMPLETED"
                    ? "#059669"
                    : remainingDays.includes("Overdue")
                    ? "#DC2626"
                    : "#D97706",
              }}
            >
              {remainingDays}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons footer */}
      <div
        style={{
          borderTop: "1px solid #F1F5F9",
          paddingTop: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        {/* Quick Stepper or Complete button */}
        {goal.status !== "COMPLETED" ? (
          <div style={{ display: "flex", gap: 4 }}>
            {[25, 50, 75, 100].map((val) => (
              <button
                key={val}
                onClick={() => onQuickProgress(goal, val)}
                title={`Set progress to ${val}%`}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: goal.progressPercentage === val ? "1px solid #3B82F6" : "1px solid #E2E8F0",
                  background: goal.progressPercentage === val ? "#EFF6FF" : "#F8FAFC",
                  color: goal.progressPercentage === val ? "#2563EB" : "#64748B",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {val}%
              </button>
            ))}
          </div>
        ) : (
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#059669",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <FiCheckCircle /> Goal Accomplished!
          </span>
        )}

        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onEdit(goal)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              background: "#FFFFFF",
              color: "#475569",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
          >
            <FiEdit2 style={{ fontSize: 12 }} /> Edit
          </button>

          <button
            onClick={() => onView(goal)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              background: "#0F172A",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2563EB")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#0F172A")}
          >
            <FiEye style={{ fontSize: 12 }} /> View
          </button>
        </div>
      </div>
    </motion.div>
  );
}
