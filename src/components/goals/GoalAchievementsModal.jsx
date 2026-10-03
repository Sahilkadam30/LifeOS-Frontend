import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiAward, FiCheck, FiLock } from "react-icons/fi";

export default function GoalAchievementsModal({ isOpen, onClose, achievements = [] }) {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const unlockPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
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
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            maxWidth: 620,
            width: "100%",
            maxHeight: "88vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid #E2E8F0",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "24px 28px",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#F8FAFC"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: 22,
                  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
                }}
              >
                🏆
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0F172A" }}>
                  Roadmap Achievements
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
                  Derived automatically from your real goal accomplishments
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#64748B"
              }}
            >
              <FiX style={{ fontSize: 16 }} />
            </button>
          </div>

          {/* Progress summary bar */}
          <div
            style={{
              padding: "16px 28px",
              background: "#FEF3C7",
              borderBottom: "1px solid #FDE68A",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#92400E" }}>
                {unlockedCount} of {totalCount} Badges Unlocked ({unlockPercentage}%)
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#B45309" }}>
                Keep completing goals and milestones to unlock remaining trophies!
              </p>
            </div>
            <div
              style={{
                width: 120,
                height: 8,
                background: "rgba(180, 83, 9, 0.2)",
                borderRadius: 4,
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${unlockPercentage}%`,
                  height: "100%",
                  background: "#D97706",
                  borderRadius: 4,
                  transition: "width 0.4s ease"
                }}
              />
            </div>
          </div>

          {/* Achievements Grid / List */}
          <div
            style={{
              padding: 24,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}
          >
            {achievements.map((ach) => (
              <div
                key={ach.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 16,
                  border: ach.unlocked ? "1px solid #BBF7D0" : "1px solid #E2E8F0",
                  background: ach.unlocked ? "#F0FDF4" : "#F8FAFC",
                  transition: "all 0.2s"
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: ach.unlocked ? "#DCFCE7" : "#E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0
                  }}
                >
                  {ach.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1E293B" }}>
                      {ach.title}
                    </h4>
                    {ach.unlocked ? (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: "#22C55E",
                          color: "#FFFFFF",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        <FiCheck style={{ fontSize: 12 }} /> Unlocked
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: "#E2E8F0",
                          color: "#64748B",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        <FiLock style={{ fontSize: 10 }} /> Locked
                      </span>
                    )}
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: 13, color: "#64748B" }}>
                    {ach.description}
                  </p>

                  {/* Progress tracker */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        flex: 1,
                        height: 6,
                        background: "#E2E8F0",
                        borderRadius: 3,
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, (ach.current / ach.target) * 100)}%`,
                          height: "100%",
                          background: ach.unlocked ? "#22C55E" : "#3B82F6",
                          borderRadius: 3
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#64748B" }}>
                      {ach.current} / {ach.target}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "16px 28px",
              borderTop: "1px solid #E2E8F0",
              display: "flex",
              justifyContent: "flex-end",
              background: "#F8FAFC"
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "9px 20px",
                borderRadius: 10,
                border: "1px solid #CBD5E1",
                background: "#FFFFFF",
                color: "#475569",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
