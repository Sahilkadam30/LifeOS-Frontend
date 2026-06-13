const priorityMap = {
  HIGH:   { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  MEDIUM: { bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" },
  LOW:    { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
};

export default function UpcomingDeadlines({ tasks = [] }) {
  const upcoming = [...tasks]
    .filter((t) => t.status !== "COMPLETED")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 8);

  return (
    <div style={{ fontFamily: "'Inter','Manrope',sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1E293B", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
        ⏰ Upcoming Deadlines
      </h2>

      {upcoming.length === 0 ? (
        <div style={{ textAlign: "center", padding: "36px 0", color: "#94A3B8" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
          <p style={{ fontSize: 14, fontWeight: 500 }}>No upcoming deadlines!</p>
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 0 }}>
          {upcoming.map((task, i) => {
            const p = priorityMap[task.priority] || { bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0" };
            return (
              <li key={task.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 4px",
                borderBottom: i < upcoming.length - 1 ? "1px solid #F1F5F9" : "none",
              }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1E293B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {task.title}
                  </p>
                  {task.category && (
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94A3B8" }}>{task.category}</p>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, marginLeft: 12, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>{task.dueDate}</span>
                  <span style={{
                    background: p.bg, color: p.color,
                    border: `1px solid ${p.border}`,
                    fontSize: 10, fontWeight: 700,
                    padding: "2px 8px", borderRadius: 99,
                  }}>
                    {task.priority}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}