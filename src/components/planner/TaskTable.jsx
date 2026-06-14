const priorityBadge = {
  HIGH:   { bg: "#FEF2F2", color: "#DC2626", label: "🔴 HIGH"   },
  MEDIUM: { bg: "#FFFBEB", color: "#B45309", label: "🟡 MEDIUM" },
  LOW:    { bg: "#F0FDF4", color: "#16A34A", label: "🟢 LOW"    },
};
const statusBadge = {
  COMPLETED:   { bg: "#F0FDF4", color: "#16A34A" },
  IN_PROGRESS: { bg: "#EFF6FF", color: "#2563EB" },
  PENDING:     { bg: "#F8FAFC", color: "#64748B" },
};

const badge = (text, map) => {
  const s = map[text] || { bg: "#F8FAFC", color: "#64748B" };
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 700,
      padding: "3px 10px", borderRadius: 99,
      letterSpacing: "0.04em", display: "inline-block",
    }}>
      {priorityBadge[text]?.label ?? text}
    </span>
  );
};

const actionBtn = (label, accent, onClick) => (
  <button onClick={onClick} style={{
    padding: "5px 13px", fontSize: 12, fontWeight: 600,
    border: `1px solid ${accent}20`, background: `${accent}10`,
    color: accent, borderRadius: 8, cursor: "pointer",
    transition: "background 0.2s",
    fontFamily: "inherit",
  }}
    onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}20`; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = `${accent}10`; }}
  >
    {label}
  </button>
);

export default function TaskTable({ tasks = [], onEdit, onDelete, onComplete }) {
  const thStyle = {
    padding: "12px 16px", textAlign: "left",
    fontSize: 11, fontWeight: 700, color: "#64748B",
    textTransform: "uppercase", letterSpacing: "0.08em",
    borderBottom: "2px solid #F1F5F9", whiteSpace: "nowrap",
    background: "#FAFBFC",
  };

  return (
    <div style={{ fontFamily: "'Inter','Manrope',sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1E293B", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
        📋 Tasks
        <span style={{ background: "#EFF6FF", color: "#2563EB", fontSize: 13, fontWeight: 700, padding: "2px 10px", borderRadius: 99 }}>
          {tasks.length}
        </span>
      </h2>

      {tasks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 15, fontWeight: 500 }}>No tasks yet. Create one above!</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                {["Task", "Priority", "Status", "Due Date", "Actions"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}
                  style={{ borderBottom: "1px solid #F1F5F9", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ margin: 0, fontWeight: 600, color: "#1E293B", fontSize: 14 }}>{task.title}</p>
                    {task.category && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94A3B8" }}>{task.category}</p>}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {badge(task.priority, priorityBadge)}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {(() => {
                      const s = statusBadge[task.status] || statusBadge.PENDING;
                      return (
                        <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>
                          {task.status || "PENDING"}
                        </span>
                      );
                    })()}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#475569", fontWeight: 500 }}>
                    {task.dueDate || "—"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {onEdit     && actionBtn("Edit",   "#2563EB", () => onEdit(task))}
                      {onComplete && actionBtn("Done",   "#16A34A", () => onComplete(task.id))}
                      {onDelete   && actionBtn("Delete", "#EF4444", () => onDelete(task.id))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}