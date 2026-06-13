import { useState } from "react";

const empty = {
  title: "", description: "", category: "",
  priority: "MEDIUM", startDate: "", dueDate: "",
  startTime: "", endTime: "", reminderEnabled: false,
};

const inputStyle = {
  width: "100%", padding: "10px 14px", fontSize: 14,
  border: "1px solid #E2E8F0", borderRadius: 10,
  background: "#F8FAFC", color: "#1E293B",
  outline: "none", fontFamily: "inherit",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block", fontSize: 12, fontWeight: 600,
  color: "#64748B", textTransform: "uppercase",
  letterSpacing: "0.07em", marginBottom: 6,
};

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function TaskForm({ onSave, editTask }) {
  const [task, setTask] = useState(editTask || empty);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const focusIn  = (e) => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; };
  const focusOut = (e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; };

  const submit = (e) => {
    e.preventDefault();
    onSave(task);
    setTask(empty);
  };

  return (
    <form onSubmit={submit} style={{ fontFamily: "'Inter','Manrope',sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1E293B", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
        {editTask ? "✏️ Edit Task" : "➕ Create New Task"}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Title *">
          <input name="title" type="text" required style={inputStyle}
            value={task.title} onChange={handleChange}
            onFocus={focusIn} onBlur={focusOut}
            placeholder="Task title…" />
        </Field>

        <Field label="Category">
          <input name="category" type="text" style={inputStyle}
            value={task.category} onChange={handleChange}
            onFocus={focusIn} onBlur={focusOut}
            placeholder="e.g. Work, Personal" />
        </Field>

        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Description">
            <textarea name="description" rows={3} style={{ ...inputStyle, resize: "vertical" }}
              value={task.description} onChange={handleChange}
              onFocus={focusIn} onBlur={focusOut}
              placeholder="Add notes or context…" />
          </Field>
        </div>

        <Field label="Priority">
          <select name="priority" style={inputStyle}
            value={task.priority} onChange={handleChange}
            onFocus={focusIn} onBlur={focusOut}>
            <option value="LOW">🟢 Low</option>
            <option value="MEDIUM">🟡 Medium</option>
            <option value="HIGH">🔴 High</option>
          </select>
        </Field>

        <Field label="Start Date">
          <input name="startDate" type="date" style={inputStyle}
            value={task.startDate} onChange={handleChange}
            onFocus={focusIn} onBlur={focusOut} />
        </Field>

        <Field label="Due Date">
          <input name="dueDate" type="date" style={inputStyle}
            value={task.dueDate} onChange={handleChange}
            onFocus={focusIn} onBlur={focusOut} />
        </Field>

        {/* Reminder */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 20 }}>
          <input type="checkbox" id="reminderEnabled" name="reminderEnabled"
            checked={task.reminderEnabled} onChange={handleChange}
            style={{ width: 16, height: 16, accentColor: "#2563EB", cursor: "pointer" }} />
          <label htmlFor="reminderEnabled" style={{ fontSize: 14, color: "#475569", fontWeight: 500, cursor: "pointer" }}>
            Enable Reminder
          </label>
        </div>
      </div>

      {/* Submit */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" style={{
          padding: "11px 28px", background: "#2563EB", color: "#fff",
          border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
          transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#1D4ED8"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,99,235,0.35)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#2563EB"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.25)"; }}
        >
          {editTask ? "Update Task" : "Save Task"}
        </button>
      </div>
    </form>
  );
}