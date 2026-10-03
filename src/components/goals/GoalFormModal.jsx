import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiCalendar, FiTag, FiFlag, FiLayers, FiZap, FiAlertCircle } from "react-icons/fi";

const CATEGORIES = [
  { id: "PERSONAL", label: "Personal", icon: "🌱" },
  { id: "HEALTH", label: "Health", icon: "❤️" },
  { id: "FITNESS", label: "Fitness", icon: "💪" },
  { id: "EDUCATION", label: "Education", icon: "📚" },
  { id: "CAREER", label: "Career", icon: "💼" },
  { id: "TRAVEL", label: "Travel", icon: "✈️" },
  { id: "HOBBY", label: "Hobby", icon: "🎨" },
  { id: "FINANCE", label: "Finance", icon: "💰" },
  { id: "RELATIONSHIP", label: "Relationship", icon: "🤝" },
  { id: "OTHER", label: "Other", icon: "✨" },
];

const PRIORITIES = [
  { id: "HIGH", label: "High Priority", color: "#EF4444" },
  { id: "MEDIUM", label: "Medium Priority", color: "#F59E0B" },
  { id: "LOW", label: "Low Priority", color: "#3B82F6" },
];

const STATUSES = [
  { id: "NOT_STARTED", label: "📝 Not Started" },
  { id: "IN_PROGRESS", label: "🔵 In Progress" },
  { id: "PAUSED", label: "⏸️ Paused" },
  { id: "COMPLETED", label: "✅ Completed" },
  { id: "ABANDONED", label: "❌ Abandoned" },
];

export default function GoalFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEdit = false,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalType: "SHORT_TERM",
    category: "PERSONAL",
    priority: "MEDIUM",
    status: "NOT_STARTED",
    progressPercentage: 0,
    startDate: "",
    targetDate: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        goalType: initialData.goalType || "SHORT_TERM",
        category: initialData.category || "PERSONAL",
        priority: initialData.priority || "MEDIUM",
        status: initialData.status || "NOT_STARTED",
        progressPercentage: initialData.progressPercentage || 0,
        startDate: initialData.startDate || "",
        targetDate: initialData.targetDate || "",
      });
    } else {
      // Defaults for new goal
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        title: "",
        description: "",
        goalType: "SHORT_TERM",
        category: "PERSONAL",
        priority: "MEDIUM",
        status: "NOT_STARTED",
        progressPercentage: 0,
        startDate: today,
        targetDate: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = "Goal title is required.";
    }

    if (formData.startDate && formData.targetDate) {
      if (new Date(formData.targetDate) < new Date(formData.startDate)) {
        errs.targetDate = "Target date cannot be earlier than start date.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        startDate: formData.startDate ? formData.startDate : null,
        targetDate: formData.targetDate ? formData.targetDate : null,
        progressPercentage: Number(formData.progressPercentage) || 0,
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ form: err.response?.data?.message || err.message || "Failed to save goal" });
    } finally {
      setSubmitting(false);
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
          zIndex: 1000,
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
            maxWidth: 620,
            width: "100%",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid #E2E8F0",
            overflow: "hidden",
            fontFamily: "'Inter', 'Manrope', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 28px",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#F8FAFC",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0F172A" }}>
                {isEdit ? "Edit Life Goal" : "Create New Life Goal"}
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748B" }}>
                Define what you want to achieve in your personal journey
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "50%",
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#64748B",
              }}
            >
              <FiX style={{ fontSize: 16 }} />
            </button>
          </div>

          {/* Form Body */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "24px 28px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {errors.form && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 12,
                  padding: "12px 16px",
                  color: "#DC2626",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FiAlertCircle />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Goal Type Selector (Short-Term vs Long-Term) */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: 8,
                }}
              >
                GOAL HORIZON / TYPE *
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div
                  onClick={() => setFormData({ ...formData, goalType: "SHORT_TERM" })}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border:
                      formData.goalType === "SHORT_TERM"
                        ? "2px solid #F59E0B"
                        : "1px solid #E2E8F0",
                    background:
                      formData.goalType === "SHORT_TERM" ? "#FFFBEB" : "#F8FAFC",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "#FDE68A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    ⚡
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#92400E" }}>
                      Short Term
                    </div>
                    <div style={{ fontSize: 11, color: "#B45309" }}>
                      Weeks / Month (e.g. Cycle 50 km)
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, goalType: "LONG_TERM" })}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border:
                      formData.goalType === "LONG_TERM"
                        ? "2px solid #6366F1"
                        : "1px solid #E2E8F0",
                    background:
                      formData.goalType === "LONG_TERM" ? "#EEF2FF" : "#F8FAFC",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "#C7D2FE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    🏔️
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#3730A3" }}>
                      Long Term
                    </div>
                    <div style={{ fontSize: 11, color: "#4F46E5" }}>
                      Months / Years (e.g. Mountain Camping)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: 6,
                }}
              >
                GOAL TITLE *
              </label>
              <input
                type="text"
                placeholder={
                  formData.goalType === "SHORT_TERM"
                    ? "e.g., Cycle 50 km this week"
                    : "e.g., Go camping in the mountains"
                }
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: errors.title ? "1px solid #EF4444" : "1px solid #CBD5E1",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {errors.title && (
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#EF4444" }}>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: 6,
                }}
              >
                DESCRIPTION & PURPOSE
              </label>
              <textarea
                rows={3}
                placeholder="Why is this important to you? What does success look like?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1px solid #CBD5E1",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Category & Priority Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Category */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  CATEGORY
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 10,
                    border: "1px solid #CBD5E1",
                    fontSize: 14,
                    background: "#FFFFFF",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  PRIORITY
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 10,
                    border: "1px solid #CBD5E1",
                    fontSize: 14,
                    background: "#FFFFFF",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  START DATE
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #CBD5E1",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  TARGET DATE (Optional for open-ended)
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: errors.targetDate ? "1px solid #EF4444" : "1px solid #CBD5E1",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {errors.targetDate && (
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#EF4444" }}>
                    {errors.targetDate}
                  </p>
                )}
              </div>
            </div>

            {/* Status (if editing) */}
            {isEdit && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#334155",
                      marginBottom: 6,
                    }}
                  >
                    STATUS
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: 10,
                      border: "1px solid #CBD5E1",
                      fontSize: 14,
                      background: "#FFFFFF",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    {STATUSES.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#334155",
                      marginBottom: 6,
                    }}
                  >
                    PROGRESS: {formData.progressPercentage}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.progressPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        progressPercentage: parseInt(e.target.value, 10),
                      })
                    }
                    style={{ width: "100%", marginTop: 10 }}
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 10,
                paddingTop: 16,
                borderTop: "1px solid #E2E8F0",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  color: "#64748B",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #3B82F6 0%, #10B981 100%)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                }}
              >
                {submitting ? "Saving..." : isEdit ? "Update Goal" : "Create Goal"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
