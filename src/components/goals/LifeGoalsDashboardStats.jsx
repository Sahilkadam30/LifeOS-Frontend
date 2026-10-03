import React from "react";
import { motion } from "framer-motion";
import {
  FiTarget,
  FiCheckCircle,
  FiPlayCircle,
  FiPauseCircle,
  FiCircle,
  FiZap,
  FiLayers,
  FiTrendingUp,
} from "react-icons/fi";

export default function LifeGoalsDashboardStats({ stats }) {
  if (!stats) return null;

  const total = stats.totalGoals || 0;
  const completed = stats.completed || 0;
  const inProgress = stats.inProgress || 0;
  const notStarted = stats.notStarted || 0;
  const paused = stats.paused || 0;
  const shortTerm = stats.shortTermGoals || 0;
  const longTerm = stats.longTermGoals || 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const kpis = [
    {
      title: "Total Goals",
      value: total,
      sub: `${completionRate}% overall completion`,
      icon: FiTarget,
      color: "from-blue-500 to-indigo-600",
      bg: "#EFF6FF",
      iconColor: "#2563EB",
    },
    {
      title: "Completed",
      value: completed,
      sub: "Achieved aspirations",
      icon: FiCheckCircle,
      color: "from-emerald-500 to-teal-600",
      bg: "#ECFDF5",
      iconColor: "#059669",
    },
    {
      title: "In Progress",
      value: inProgress,
      sub: "Active milestones",
      icon: FiPlayCircle,
      color: "from-sky-500 to-blue-600",
      bg: "#F0F9FF",
      iconColor: "#0284C7",
    },
    {
      title: "Not Started",
      value: notStarted,
      sub: "Pending kickoff",
      icon: FiCircle,
      color: "from-slate-400 to-slate-600",
      bg: "#F8FAFC",
      iconColor: "#64748B",
    },
    {
      title: "Paused",
      value: paused,
      sub: "On temporary hold",
      icon: FiPauseCircle,
      color: "from-amber-400 to-amber-600",
      bg: "#FFFBEB",
      iconColor: "#D97706",
    },
  ];

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Top 5 KPI Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                background: "#FFFFFF",
                borderRadius: 16,
                border: "1px solid #E2E8F0",
                padding: "18px 20px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}>
                  {kpi.title}
                </span>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: kpi.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: kpi.iconColor,
                  }}
                >
                  <Icon style={{ fontSize: 18 }} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", lineHeight: 1.1, marginBottom: 4 }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>
                  {kpi.sub}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Goal Horizon Balance Bar: Short-Term vs Long-Term */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#FEF3C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              ⚡
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#92400E" }}>
                Short-Term Goals
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#78350F" }}>
                {shortTerm} goals
              </div>
            </div>
          </div>

          <div style={{ height: 28, width: 1, background: "#E2E8F0" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#EEF2FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🏔️
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#3730A3" }}>
                Long-Term Goals
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#312E81" }}>
                {longTerm} goals
              </div>
            </div>
          </div>
        </div>

        {/* Overall progress indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 220 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: "#64748B" }}>Overall Roadmap Progress</span>
              <span style={{ fontWeight: 800, color: "#10B981" }}>{stats.overallProgress}%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 8,
                background: "#F1F5F9",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${stats.overallProgress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #3B82F6 0%, #10B981 100%)",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
