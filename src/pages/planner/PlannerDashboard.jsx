import { useEffect, useState } from "react";
import PlannerSidebar from "../../components/planner/PlannerSidebar";
import PlannerStats   from "../../components/planner/PlannerStats";
import TaskCalendar   from "../../components/planner/TaskCalendar";
import UpcomingDeadlines from "../../components/planner/UpcomingDeadlines";
import PriorityBoard  from "../../components/planner/PriorityBoard";
import { getTasks, getDashboard } from "../../services/plannerService";

const card = {
  background: "#FFFFFF",
  borderRadius: 16,
  border: "1px solid #E2E8F0",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: 24,
  fontFamily: "'Inter','Manrope',sans-serif",
};

export default function PlannerDashboard() {
  const [tasks,     setTasks]     = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true); setError(null);
    try {
      const [taskRes, dashRes] = await Promise.all([getTasks(), getDashboard()]);
      setTasks(Array.isArray(taskRes.data) ? taskRes.data : []);
      setDashboard(dashRes.data || {});
    } catch (err) {
      console.error(err);
      setError("Failed to load planner data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: "Total Tasks",  value: dashboard.totalTasks        ?? tasks.length },
    { title: "Completed",    value: dashboard.completedTasks    ?? tasks.filter((t) => t.status === "COMPLETED").length },
    { title: "Pending",      value: dashboard.pendingTasks      ?? tasks.filter((t) => t.status !== "COMPLETED").length },
    { title: "Upcoming",     value: dashboard.upcomingDeadlines ?? 0 },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F7FA", fontFamily: "'Inter','Manrope',sans-serif" }}>
      <PlannerSidebar />

      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {/* ── Page Header ─────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>
            Smart Planner
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1E293B", margin: "0 0 6px", lineHeight: 1.2 }}>
            Planner Dashboard
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: 0 }}>
            Track tasks, deadlines and priorities at a glance.
          </p>
        </div>

        {/* ── Error ───────────────────────── */}
        {error && (
          <div style={{ ...card, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", marginBottom: 24, display: "flex", alignItems: "center", gap: 10, padding: "16px 20px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Loading ─────────────────────── */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, flexDirection: "column", gap: 16 }}>
            <div className="fintech-spinner" />
            <p style={{ color: "#64748B", fontSize: 15 }}>Loading planner…</p>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
              {stats.map((s) => <PlannerStats key={s.title} title={s.title} value={s.value} />)}
            </div>

            {/* Calendar + Upcoming */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
              <div style={card}>
                <TaskCalendar tasks={tasks} />
              </div>
              <div style={card}>
                <UpcomingDeadlines tasks={tasks} />
              </div>
            </div>

            {/* Priority Board */}
            <div style={card}>
              <PriorityBoard tasks={tasks} />
            </div>
          </>
        )}
      </main>

      <style>{`
        .fintech-spinner {
          width: 36px; height: 36px;
          border: 4px solid #E2E8F0;
          border-top-color: #2563EB;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1100px) {
          .planner-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 900px) {
          .planner-cal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}