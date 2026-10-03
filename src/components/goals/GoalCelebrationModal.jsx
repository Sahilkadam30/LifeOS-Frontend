import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiX } from "react-icons/fi";

export default function GoalCelebrationModal({ isOpen, onClose, goalTitle, goalType }) {
  if (!isOpen) return null;

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
          padding: 20
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            maxWidth: 460,
            width: "100%",
            padding: 32,
            position: "relative",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            overflow: "hidden"
          }}
        >
          {/* Subtle top celebration accent bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: "linear-gradient(90deg, #F59E0B, #10B981, #3B82F6, #8B5CF6)"
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: "#F1F5F9",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748B",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#E2E8F0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#F1F5F9")}
          >
            <FiX style={{ fontSize: 16 }} />
          </button>

          {/* Animated Celebration Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.1 }}
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)",
              fontSize: 34
            }}
          >
            🎉
          </motion.div>

          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "#ECFDF5",
              color: "#059669",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 10
            }}
          >
            Milestone Reached!
          </span>

          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#0F172A",
              margin: "0 0 10px",
              lineHeight: 1.25
            }}
          >
            Goal Completed!
          </h2>

          <div
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: 16,
              padding: "16px 20px",
              margin: "16px 0 20px"
            }}
          >
            <p
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#1E293B",
                margin: "0 0 6px"
              }}
            >
              "{goalTitle || "Your Goal"}"
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#64748B",
                margin: 0
              }}
            >
              {goalType === "LONG_TERM" ? "🏔️ Long-Term Goal" : "⚡ Short-Term Goal"}
            </p>
          </div>

          <p
            style={{
              fontSize: 15,
              color: "#475569",
              lineHeight: 1.5,
              margin: "0 0 24px"
            }}
          >
            You achieved one of your life goals! Every milestone completed is another step forward in your journey.
          </p>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "12px 24px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 15,
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Keep Crushing Goals 🚀
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
