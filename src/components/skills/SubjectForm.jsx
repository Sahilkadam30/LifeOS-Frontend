import { useState } from "react";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition";

export default function SubjectForm({ onSubmit }) {
  const [form, setForm] = useState({
    subjectName: "",
    description: "",
    status: "NOT_STARTED",
    startDate: "",
    targetDate: "",
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ subjectName: "", description: "", status: "NOT_STARTED", startDate: "", targetDate: "" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 mb-6">
      <h2 className="text-base font-bold text-[#0F172A] mb-5">Add Subject</h2>
      <form onSubmit={submit} className="space-y-4">
        <input className={inputCls} placeholder="Subject Name" value={form.subjectName} onChange={set("subjectName")} required />
        <textarea className={inputCls} rows={3} placeholder="Description" value={form.description} onChange={set("description")} />
        <select className={inputCls} value={form.status} onChange={set("status")}>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#64748B] mb-1 font-medium">Start Date</label>
            <input type="date" className={inputCls} value={form.startDate} onChange={set("startDate")} />
          </div>
          <div>
            <label className="block text-xs text-[#64748B] mb-1 font-medium">Target Date</label>
            <input type="date" className={inputCls} value={form.targetDate} onChange={set("targetDate")} />
          </div>
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl transition"
        >
          Save Subject
        </button>
      </form>
    </div>
  );
}