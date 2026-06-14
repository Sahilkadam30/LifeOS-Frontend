import { useState } from "react";
import SuccessModal from "../SuccessModal";

const savingTypes = [
  { value: "DAILY_SAVING",   label: "Daily Saving"   },
  { value: "WEEKLY_SAVING",  label: "Weekly Saving"  },
  { value: "MONTHLY_SAVING", label: "Monthly Saving" },
  { value: "EMERGENCY_FUND", label: "Emergency Fund" },
];

const emptyForm = {
  amount: "",
  savingType: "DAILY_SAVING",
  savingDate: "",
  notes: "",
};

export default function SavingsForm({ onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
      setForm(emptyForm);
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={submit}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4"
      >
        <h5 className="text-base font-semibold text-gray-700">🏦 Add Saving</h5>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Amount (₹)
          </label>
          <input
            required
            type="number"
            min="0"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            placeholder="0"
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Saving Type
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            value={form.savingType}
            onChange={(e) => update("savingType", e.target.value)}
          >
            {savingTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Date
          </label>
          <input
            required
            type="date"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            value={form.savingDate}
            onChange={(e) => update("savingDate", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Notes
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
            placeholder="Optional notes..."
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors duration-150"
        >
          {loading ? "Saving…" : "Save Entry"}
        </button>
      </form>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Saving Recorded!"
        description="Your savings entry has been added to your tracker successfully."
      />
    </>
  );
}