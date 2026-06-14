import { useState } from "react";
import SuccessModal from "../SuccessModal";

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
  "Education",
  "Health",
  "Others",
];

const emptyForm = {
  title: "",
  category: "",
  amount: "",
  expenseDate: "",
  notes: "",
};

export default function ExpenseForm({ onSave }) {
  const [expense, setExpense] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const update = (field, value) =>
    setExpense((prev) => ({ ...prev, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(expense);
      setExpense(emptyForm);
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
        <h5 className="text-base font-semibold text-gray-700">➕ Add Expense</h5>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Title
          </label>
          <input
            required
            type="text"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            placeholder="e.g. Grocery run"
            value={expense.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Category
          </label>
          <select
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={expense.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Amount (₹)
          </label>
          <input
            required
            type="number"
            min="0"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            placeholder="0"
            value={expense.amount}
            onChange={(e) => update("amount", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Date
          </label>
          <input
            required
            type="date"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={expense.expenseDate}
            onChange={(e) => update("expenseDate", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Notes
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
            placeholder="Optional notes..."
            value={expense.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors duration-150"
        >
          {loading ? "Saving…" : "Save Expense"}
        </button>
      </form>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Expense Saved!"
        description="Your expense has been recorded to your tracker successfully."
      />
    </>
  );
}