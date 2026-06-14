import { useState } from "react";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition";

export default function SkillProgressForm({ onSubmit }) {
  const [form, setForm] = useState({
    skillName: "",
    progressPercentage: 0,
    skillLevel: "BEGINNER",
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ skillName: "", progressPercentage: 0, skillLevel: "BEGINNER" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 mb-6">
      <h2 className="text-base font-bold text-[#0F172A] mb-5">Add Skill Progress</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input className={inputCls} placeholder="Skill Name" value={form.skillName} onChange={set("skillName")} required />
          <div>
            <label className="block text-xs text-[#64748B] mb-1 font-medium">Progress: {form.progressPercentage}%</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={form.progressPercentage}
              onChange={set("progressPercentage")}
              className="w-full accent-[#2563EB]"
            />
          </div>
          <select className={inputCls} value={form.skillLevel} onChange={set("skillLevel")}>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl transition"
        >
          Save Progress
        </button>
      </form>
    </div>
  );
}