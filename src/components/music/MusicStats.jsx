import React from "react";
import {
  FiMusic,
  FiClock,
  FiMic,
  FiActivity,
  FiHeart,
  FiAward,
} from "react-icons/fi";

export default function MusicStats({ stats }) {
  if (!stats) return null;

  const statItems = [
    {
      title: "Total Recordings",
      value: stats.totalRecordings || 0,
      icon: FiMusic,
      color: "#3B82F6",
      bg: "rgba(59, 130, 246, 0.12)",
      borderColor: "rgba(59, 130, 246, 0.25)",
      sub: `${stats.completedProjectsCount || 0} completed projects`,
    },
    {
      title: "Total Practice Time",
      value: stats.totalPracticeFormatted || "0h 0m",
      icon: FiClock,
      color: "#10B981",
      bg: "rgba(16, 185, 129, 0.12)",
      borderColor: "rgba(16, 185, 129, 0.25)",
      sub: `${stats.weeklyPracticeSessions || 0} sessions this week`,
    },
    {
      title: "Songs & Singing",
      value: (stats.songsCount || 0) + (stats.singingCount || 0),
      icon: FiMic,
      color: "#EC4899",
      bg: "rgba(236, 72, 153, 0.12)",
      borderColor: "rgba(236, 72, 153, 0.25)",
      sub: `${stats.songsCount || 0} songs • ${stats.singingCount || 0} vocals`,
    },
    {
      title: "Instrument Tracks",
      value: stats.instrumentsCount || 0,
      icon: FiActivity,
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.12)",
      borderColor: "rgba(245, 158, 11, 0.25)",
      sub: "Guitar, Piano, Drums & more",
    },
    {
      title: "Music Ideas",
      value: stats.musicIdeasCount || 0,
      icon: "💡",
      color: "#EAB308",
      bg: "rgba(234, 179, 8, 0.12)",
      borderColor: "rgba(234, 179, 8, 0.25)",
      sub: "Melodies & inspirations",
    },
    {
      title: "Favorites",
      value: stats.favoritesCount || 0,
      icon: FiHeart,
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.12)",
      borderColor: "rgba(239, 68, 68, 0.25)",
      sub: "Proudest compositions",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 14,
        marginBottom: 26,
      }}
    >
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            style={{
              background: "#FFFFFF",
              borderRadius: 14,
              border: `1px solid ${item.borderColor}`,
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
              transition: "transform 0.15s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {item.title}
              </span>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: item.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: item.color,
                  fontSize: typeof item.icon === "string" ? 16 : 14,
                }}
              >
                {typeof Icon === "string" ? Icon : <Icon />}
              </div>
            </div>

            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#0F172A",
                lineHeight: 1.1,
              }}
            >
              {item.value}
            </div>

            {item.sub && (
              <span
                style={{
                  fontSize: 11,
                  color: "#64748B",
                  marginTop: 2,
                }}
              >
                {item.sub}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
