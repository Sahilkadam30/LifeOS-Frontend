import { useEffect, useState } from "react";
import FinanceSidebar from "../../components/finance/FinanceSidebar";
import ExpenseForm from "../../components/finance/ExpenseForm";
import ExpenseTable from "../../components/finance/ExpenseTable";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import {
  getExpenses,
  createExpense,
  deleteExpense,
} from "../../services/financeService";

const ALL_CATEGORIES = [
  "All",
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
  "Education",
  "Health",
  "Others",
];

export default function ExpenseTrackerPage() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const res = await getExpenses();
      setExpenses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveExpense = async (expense) => {
    try {
      await createExpense(expense);
      loadExpenses();
    } catch (err) {
      console.error("Failed to save expense:", err);
    }
  };

  const triggerDeleteExpense = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteExpense = async () => {
    if (!deleteId) return;
    try {
      await deleteExpense(deleteId);
      setExpenses((prev) => prev.filter((e) => e.id !== deleteId));
    } catch (err) {
      console.error("Failed to delete expense:", err);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      category === "All" || expense.category === category;
    return matchesSearch && matchesCategory;
  });

  const totalAmount = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  return (
    <div className="flex bg-gray-50" style={{ minHeight: "100vh" }}>
      <FinanceSidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Expense Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your daily expenses.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-red-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total (Filtered)
            </p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              ₹{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Records
            </p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {filteredExpenses.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-green-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              All Records
            </p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {expenses.length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            placeholder="🔍 Search expense..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="sm:w-52 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Form + Table */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-80 shrink-0">
            <ExpenseForm onSave={saveExpense} />
          </div>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center h-40 text-gray-400">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mr-3" />
                Loading...
              </div>
            ) : (
              <ExpenseTable
                expenses={filteredExpenses}
                onDelete={triggerDeleteExpense}
              />
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteId(null); }}
        onConfirm={confirmDeleteExpense}
        title="Delete Expense?"
        description="Do you want to delete this expense entry? This action cannot be undone."
      />
    </div>
  );
}