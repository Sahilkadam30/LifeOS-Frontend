import { useEffect, useState, useMemo } from "react";
import FinanceSidebar from "../../components/finance/FinanceSidebar";
import SavingsForm from "../../components/finance/SavingsForm";
import SavingsTable from "../../components/finance/SavingsTable";
import SavingsTrendChart from "../../components/finance/SavingsTrendChart";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import {
  getSavings,
  createSaving,
  deleteSaving,
} from "../../services/financeService";

export default function SavingsTrackerPage() {
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadSavings();
  }, []);

  const loadSavings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSavings();
      setSavings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load savings:", err);
      setError("Failed to load savings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const save = async (data) => {
    try {
      await createSaving(data);
      loadSavings();
    } catch (err) {
      console.error("Failed to save entry:", err);
    }
  };

  const triggerDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSaving(deleteId);
      setSavings((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (err) {
      console.error("Failed to delete saving:", err);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const totalSavings = savings.reduce(
    (sum, s) => sum + Number(s.amount || 0),
    0
  );

  // Build trend chart data from actual savings
  const trendData = useMemo(() => {
    if (savings.length === 0) return [];
    const sorted = [...savings]
      .filter((s) => s.savingDate)
      .sort((a, b) => new Date(a.savingDate) - new Date(b.savingDate));

    let cumulative = 0;
    return sorted.map((s) => {
      cumulative += Number(s.amount || 0);
      return {
        date: s.savingDate,
        amount: cumulative,
      };
    });
  }, [savings]);

  return (
    <div className="flex bg-gray-50" style={{ minHeight: "100vh" }}>
      <FinanceSidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Savings Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your savings and watch your wealth grow.
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={loadSavings}
              className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total Savings
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              ₹{totalSavings.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total Records
            </p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {savings.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-purple-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Avg. Per Entry
            </p>
            <p className="text-2xl font-bold text-purple-700 mt-1">
              ₹{savings.length > 0
                ? Math.round(totalSavings / savings.length).toLocaleString()
                : 0}
            </p>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="mb-6">
          <SavingsTrendChart data={trendData} />
        </div>

        {/* Form + Table */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-80 shrink-0">
            <SavingsForm onSave={save} />
          </div>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center h-40 text-gray-400">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3" />
                Loading savings...
              </div>
            ) : (
              <SavingsTable savings={savings} onDelete={triggerDelete} />
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteId(null); }}
        onConfirm={confirmDelete}
        title="Delete Saving Entry?"
        description="Do you want to delete this saving entry? This action cannot be undone."
      />
    </div>
  );
}