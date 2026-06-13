const cols = [
  { key: "HIGH",   label: "🔴 High Priority",   headerColor: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  { key: "MEDIUM", label: "🟡 Medium Priority",  headerColor: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
  { key: "LOW",    label: "🟢 Low Priority",     headerColor: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
];

const statusMap = {
  COMPLETED:   { bg: "#F0FDF4", color: "#16A34A" },
  IN_PROGRESS: { bg: "#EFF6FF", color: "#2563EB" },
  PENDING:     { bg: "#F8FAFC", color: "#64748B" },
};

export default function PriorityBoard({ tasks = [] }) {
  const grouped = {
    HIGH:   tasks.filter((t) => t.priority === "HIGH"),
    MEDIUM: tasks.filter((t) => t.priority === "MEDIUM"),
    LOW:    tasks.filter((t) => t.priority === "LOW"),
  };

  return (
    <div style={{ fontFamily: "'Inter','Manrope',sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1E293B", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
        📌 Priority Board
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {cols.map((col) => (
          <div key={col.key} style={{
            background: col.bg, border: `1px solid ${col.border}`,
            borderRadius: 14, padding: "16px 16px",
          }}>
            {/* Column header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: col.headerColor, margin: 0 }}>{col.label}</h3>
              <span style={{
                background: col.headerColor + "20", color: col.headerColor,
                fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 99,
              }}>
                {grouped[col.key].length}
              </span>
            </div>

            {/* Cards */}
            {grouped[col.key].length === 0 ? (
              <p style={{ fontSize: 13, color: "#94A3B8", textAlign: "center", padding: "18px 0", margin: 0 }}>No tasks</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {grouped[col.key].map((task) => {
                  const s = statusMap[task.status] || statusMap.PENDING;
                  return (
                    <div key={task.id} style={{
                      background: "#FFFFFF", borderRadius: 12,
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                      padding: "12px 14px",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.10)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
                    >
                      <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#1E293B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {task.title}
                      </p>
                      {task.category && <p style={{ margin: "0 0 8px", fontSize: 12, color: "#94A3B8" }}>{task.category}</p>}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                        <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>
                          {task.status || "PENDING"}
                        </span>
                        <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{task.dueDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}