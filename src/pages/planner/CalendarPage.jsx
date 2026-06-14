import { useEffect, useState } from "react";
import PlannerSidebar from "../../components/planner/PlannerSidebar";
import TaskCalendar   from "../../components/planner/TaskCalendar";
import { getTasks }   from "../../services/plannerService";

const card = {
  background: "#FFFFFF", borderRadius: 16,
  border: "1px solid #E2E8F0",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: 24, fontFamily: "'Inter','Manrope',sans-serif",
};

export default function CalendarPage() {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    setLoading(true); setError(null);
    try {
      const res = await getTasks();
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); setError("Could not load tasks for calendar."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F7FA", fontFamily: "'Inter','Manrope',sans-serif" }}>
      <PlannerSidebar />

      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>
            Smart Planner
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1E293B", margin: "0 0 6px" }}>Calendar View</h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: 0 }}>Visualise your tasks plotted on a calendar.</p>
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
          <div style={card}>
            <TaskCalendar tasks={tasks} />
          </div>
        )}
      </main>

      <style>{`
        .fintech-spinner { width:36px;height:36px;border:4px solid #E2E8F0;border-top-color:#2563EB;border-radius:50%;animation:spin .8s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}