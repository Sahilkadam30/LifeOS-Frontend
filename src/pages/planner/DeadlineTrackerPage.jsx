import { useEffect, useState } from "react";
import PlannerSidebar    from "../../components/planner/PlannerSidebar";
import UpcomingDeadlines from "../../components/planner/UpcomingDeadlines";
import { getTasks }      from "../../services/plannerService";

const card = {
  background: "#FFFFFF", borderRadius: 16,
  border: "1px solid #E2E8F0",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: 24, fontFamily: "'Inter','Manrope',sans-serif",
};

const statRow = (label, value, accent, bg) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: bg, borderRadius: 12, padding: "12px 18px" }}>
    <span style={{ fontSize: 14, fontWeight: 500, color: "#475569" }}>{label}</span>
    <span style={{ fontSize: 28, fontWeight: 700, color: accent }}>{value}</span>
  </div>
);

export default function DeadlineTrackerPage() {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    setLoading(true); setError(null);
    try {
      const res = await getTasks();
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); setError("Could not load tasks."); }
    finally { setLoading(false); }
  };

  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const pending   = tasks.filter((t) => t.status !== "COMPLETED").length;
  const pct       = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F7FA", fontFamily: "'Inter','Manrope',sans-serif" }}>
      <PlannerSidebar />

      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>
            Smart Planner
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1E293B", margin: "0 0 6px" }}>Deadline Tracker</h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: 0 }}>Stay on top of all your upcoming deadlines.</p>
        </div>

        {error && (
          <div style={{ ...card, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", marginBottom: 24, padding: "14px 20px" }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
            <div className="fintech-spinner" />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            {/* Deadline list */}
            <div style={card}>
              <UpcomingDeadlines tasks={tasks} />
            </div>

            {/* Summary */}
            <div style={{ ...card, display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1E293B", margin: 0 }}>Summary</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {statRow("Total Tasks", tasks.length, "#2563EB", "#EFF6FF")}
                {statRow("Pending",     pending,       "#F59E0B", "#FFFBEB")}
                {statRow("Completed",   completed,     "#16A34A", "#F0FDF4")}
              </div>

              {/* Progress */}
              {tasks.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748B", marginBottom: 6, fontWeight: 500 }}>
                    <span>Completion Progress</span>
                    <span style={{ color: "#16A34A", fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ width: "100%", height: 10, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#16A34A,#00C853)", borderRadius: 99, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <style>{`
        .fintech-spinner { width:36px;height:36px;border:4px solid #E2E8F0;border-top-color:#2563EB;border-radius:50%;animation:spin .8s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @media (max-width: 900px) { .deadline-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}