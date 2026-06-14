import { useEffect, useState } from "react";
import PlannerSidebar from "../../components/planner/PlannerSidebar";
import TaskForm  from "../../components/planner/TaskForm";
import TaskTable from "../../components/planner/TaskTable";
import SuccessModal from "../../components/SuccessModal";
import { getTasks, createTask, updateTask, deleteTask, markCompleted } from "../../services/plannerService";

const card = {
  background: "#FFFFFF", borderRadius: 16,
  border: "1px solid #E2E8F0",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: 24,
  fontFamily: "'Inter','Manrope',sans-serif",
};

export default function TaskManagerPage() {
  const [tasks,    setTasks]    = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: "", description: "" });

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    setLoading(true); setError(null);
    try {
      const res = await getTasks();
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); setError("Could not load tasks."); }
    finally { setLoading(false); }
  };

  const handleSave = async (task) => {
    try {
      if (editTask) {
        await updateTask(editTask.id, task);
        setSuccessInfo({
          title: "Task Updated!",
          description: "Your task changes have been saved successfully.",
        });
        setEditTask(null);
      } else {
        await createTask(task);
        setSuccessInfo({
          title: "Task Created!",
          description: "Your new task has been created successfully.",
        });
      }
      setShowSuccess(true);
      loadTasks();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try { await deleteTask(id); loadTasks(); } catch (err) { console.error(err); }
  };

  const handleComplete = async (id) => {
    try { await markCompleted(id); loadTasks(); } catch (err) { console.error(err); }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F7FA", fontFamily: "'Inter','Manrope',sans-serif" }}>
      <PlannerSidebar />

      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>
            Smart Planner
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1E293B", margin: "0 0 6px" }}>Task Manager</h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: 0 }}>Create, edit and manage all your tasks.</p>
        </div>

        {error && (
          <div style={{ ...card, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", marginBottom: 24, padding: "14px 20px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form card */}
        <div style={{ ...card, marginBottom: 24 }}>
          <TaskForm onSave={handleSave} editTask={editTask} key={editTask?.id ?? "new"} />
          {editTask && (
            <div style={{ marginTop: 12, fontSize: 13, color: "#64748B", display: "flex", alignItems: "center", gap: 8 }}>
              Editing: <span style={{ color: "#2563EB", fontWeight: 600 }}>{editTask.title}</span>
              <button onClick={() => setEditTask(null)} style={{ color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>Cancel</button>
            </div>
          )}
        </div>

        {/* Table card */}
        <div style={card}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 160 }}>
              <div className="fintech-spinner" />
            </div>
          ) : (
            <TaskTable tasks={tasks} onEdit={setEditTask} onDelete={handleDelete} onComplete={handleComplete} />
          )}
        </div>
      </main>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={successInfo.title}
        description={successInfo.description}
      />

      <style>{`
        .fintech-spinner { width:36px;height:36px;border:4px solid #E2E8F0;border-top-color:#2563EB;border-radius:50%;animation:spin .8s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}