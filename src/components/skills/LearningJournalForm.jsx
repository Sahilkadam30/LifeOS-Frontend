import { useState } from "react";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition";

export default function LearningJournalForm({ onSubmit, initialData = {} }) {
  const [form, setForm] = useState({
    title: initialData.title || "",
    learnedToday: initialData.learnedToday || "",
    notes: initialData.notes || "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: "", learnedToday: "", notes: "" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 mb-6">
      <h2 className="text-base font-bold text-[#0F172A] mb-5">New Journal Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className={inputCls}
          placeholder="Topic / Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          className={inputCls}
          rows={4}
          placeholder="What did you learn today?"
          name="learnedToday"
          value={form.learnedToday}
          onChange={handleChange}
          required
        />
        <textarea
          className={inputCls}
          rows={3}
          placeholder="Additional notes (optional)"
          name="notes"
          value={form.notes}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold rounded-xl transition"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
}