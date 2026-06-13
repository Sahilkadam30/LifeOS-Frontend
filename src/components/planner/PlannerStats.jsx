const iconMap = {
  "Total Tasks": { emoji: "📋", accent: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  "Completed":   { emoji: "✅", accent: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
  "Pending":     { emoji: "⏳", accent: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
  "Upcoming":    { emoji: "🔔", accent: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
};

export default function PlannerStats({ title, value }) {
  const meta = iconMap[title] || { emoji: "📌", accent: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" };

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        border: `1px solid ${meta.border}`,
        padding: "22px 24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 18,
        transition: "transform 0.3s, box-shadow 0.3s",
        cursor: "default",
        fontFamily: "'Inter', 'Manrope', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
      }}
    >
      {/* Icon */}
      <div style={{
        width: 54, height: 54, borderRadius: 14,
        background: meta.bg, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 24, flexShrink: 0,
      }}>
        {meta.emoji}
      </div>

      {/* Text */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 4px" }}>
          {title}
        </p>
        <p style={{ fontSize: 36, fontWeight: 700, color: meta.accent, margin: 0, lineHeight: 1 }}>
          {value}
        </p>
      </div>
    </div>
  );
}