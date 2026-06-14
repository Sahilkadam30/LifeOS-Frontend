import { useState } from "react";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00C853] transition";

export default function StudySessionForm({ onSubmit }) {
  const [form, setForm] = useState({
    subjectName: "",
    hoursStudied: "",
    studyDate: "",
    notes: "",
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ subjectName: "", hoursStudied: "", studyDate: "", notes: "" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 mb-6">
      <h2 className="text-base font-bold text-[#0F172A] mb-5">Log Study Session</h2>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input className={inputCls} placeholder="Subject Name" value={form.subjectName} onChange={set("subjectName")} required />
          <input type="number" className={inputCls} placeholder="Hours Studied" value={form.hoursStudied} onChange={set("hoursStudied")} min="0" step="0.5" required />
          <div>
            <label className="block text-xs text-[#64748B] mb-1 font-medium">Study Date</label>
            <input type="date" className={inputCls} value={form.studyDate} onChange={set("studyDate")} required />
          </div>
        </div>
        <textarea className={inputCls} rows={3} placeholder="Notes (optional)" value={form.notes} onChange={set("notes")} />
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#00C853] hover:bg-[#00B048] text-white text-sm font-semibold rounded-xl transition"
        >
          Save Session
        </button>
      </form>
    </div>
  );
}