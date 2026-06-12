import { useEffect, useState } from "react";
import FinanceSidebar from "../../components/finance/FinanceSidebar";
import InvestmentForm from "../../components/finance/InvestmentForm";
import InvestmentTable from "../../components/finance/InvestmentTable";
import {
  getInvestments,
  createInvestment,
  deleteInvestment,
} from "../../services/financeService";

export default function InvestmentTrackerPage() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInvestments();
      setInvestments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load investments:", err);
      setError("Failed to load investments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const save = async (data) => {
    try {
      await createInvestment(data);
      loadInvestments();
    } catch (err) {
      console.error("Failed to save investment:", err);
    }
  };

  const remove = async (id) => {
    try {
      await deleteInvestment(id);
      setInvestments((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Failed to delete investment:", err);
    }
  };

  const totalInvested = investments.reduce(
    (sum, i) => sum + Number(i.investedAmount || 0),
    0
  );
  const currentValue = investments.reduce(
    (sum, i) => sum + Number(i.currentValue || 0),
    0
  );
  const profit = currentValue - totalInvested;

  return (
    <div className="flex bg-gray-50" style={{ minHeight: "100vh" }}>
      <FinanceSidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Investment Tracker
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor your investment portfolio.
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={loadInvestments}
              className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total Invested
            </p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              ₹{totalInvested.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-indigo-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Current Value
            </p>
            <p className="text-2xl font-bold text-indigo-700 mt-1">
              ₹{currentValue.toLocaleString()}
            </p>
          </div>
          <div
            className={`bg-white rounded-xl border p-5 shadow-sm ${
              profit >= 0 ? "border-green-200" : "border-red-200"
            }`}
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Profit / Loss
            </p>
            <p
              className={`text-2xl font-bold mt-1 ${
                profit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {profit >= 0 ? "+" : ""}₹{profit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Form + Table */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-80 shrink-0">
            <InvestmentForm onSave={save} />
          </div>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center h-40 text-gray-400">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
                Loading investments...
              </div>
            ) : (
              <InvestmentTable
                investments={investments}
                onDelete={remove}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}