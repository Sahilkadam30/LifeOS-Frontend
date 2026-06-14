import { useState } from "react";
import SuccessModal from "../SuccessModal";

const investmentTypes = [
  { value: "MUTUAL_FUND", label: "Mutual Fund" },
  { value: "STOCK",       label: "Stock"        },
  { value: "FD",          label: "Fixed Deposit" },
  { value: "GOLD",        label: "Gold"          },
  { value: "ETF",         label: "ETF"           },
  { value: "CRYPTO",      label: "Crypto"        },
  { value: "OTHER",       label: "Other"         },
];

const emptyForm = {
  investmentName: "",
  investmentType: "MUTUAL_FUND",
  investedAmount: "",
  currentValue: "",
  investmentDate: "",
  notes: "",
};

export default function InvestmentForm({ onSave }) {
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
        <h5 className="text-base font-semibold text-gray-700">📈 Add Investment</h5>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Investment Name
          </label>
          <input
            required
            type="text"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="e.g. Nifty 50 Index Fund"
            value={form.investmentName}
            onChange={(e) => update("investmentName", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Type
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={form.investmentType}
            onChange={(e) => update("investmentType", e.target.value)}
          >
            {investmentTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              Invested (₹)
            </label>
            <input
              required
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="0"
              value={form.investedAmount}
              onChange={(e) => update("investedAmount", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              Current Value (₹)
            </label>
            <input
              required
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="0"
              value={form.currentValue}
              onChange={(e) => update("currentValue", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Investment Date
          </label>
          <input
            required
            type="date"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={form.investmentDate}
            onChange={(e) => update("investmentDate", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Notes
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
            placeholder="Optional notes..."
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors duration-150"
        >
          {loading ? "Saving…" : "Save Investment"}
        </button>
      </form>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Investment Saved!"
        description="Your investment has been added to the portfolio successfully."
      />
    </>
  );
}