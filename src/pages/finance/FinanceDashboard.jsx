import { useEffect, useState, useMemo } from "react";

import FinanceSidebar from "../../components/finance/FinanceSidebar";
import FinanceStats from "../../components/finance/FinanceStats";

import {
  getDashboard,
  getExpenses,
  getSavings,
  getInvestments,
} from "../../services/financeService";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

const CHART_HEIGHT = 280;

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const PIE_COLORS = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316",
];

/* ── Tooltips ── */
const LineTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 14px", fontSize: 13, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <p style={{ fontWeight: 600, color: "#374151", marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.stroke, fontWeight: 700, margin: 0 }}>
          {p.name}: ₹{Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 14px", fontSize: 13, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <p style={{ fontWeight: 600, color: "#374151", margin: 0 }}>{d.name}</p>
      <p style={{ fontWeight: 700, color: d.payload.fill, margin: 0 }}>
        ₹{Number(d.value).toLocaleString()}
      </p>
    </div>
  );
};

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 14px", fontSize: 13, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <p style={{ fontWeight: 600, color: "#374151", margin: 0 }}>{label}</p>
      <p style={{ fontWeight: 700, color: "#ef4444", margin: 0 }}>
        ₹{Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
};

/* ── Chart wrapper: ensures ResponsiveContainer always has a measurable parent ── */
function ChartBox({ title, children }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      padding: 24,
    }}>
      <h5 style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 16, marginTop: 0 }}>{title}</h5>
      {/* block display + explicit height = ResponsiveContainer can measure correctly */}
      <div style={{ display: "block", width: "100%", height: CHART_HEIGHT }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── Empty placeholder ── */
const EmptyChart = ({ title, icon }) => (
  <div style={{
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    padding: 24,
  }}>
    <h5 style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 16, marginTop: 0 }}>{title}</h5>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 160, color: "#9ca3af" }}>
      <span style={{ fontSize: 32, marginBottom: 8 }}>{icon}</span>
      <p style={{ fontSize: 13, margin: 0 }}>No data available yet.</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */

export default function FinanceDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, expRes, savRes, invRes] = await Promise.all([
        getDashboard().catch(() => ({ data: {} })),
        getExpenses().catch(() => ({ data: [] })),
        getSavings().catch(() => ({ data: [] })),
        getInvestments().catch(() => ({ data: [] })),
      ]);
      setDashboard(dashRes.data || {});
      setExpenses(Array.isArray(expRes.data) ? expRes.data : []);
      setSavings(Array.isArray(savRes.data) ? savRes.data : []);
      setInvestments(Array.isArray(invRes.data) ? invRes.data : []);
    } catch (err) {
      console.error("Finance Dashboard Error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Derived chart data ── */

  const expenseChartData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      if (!e.expenseDate) return;
      const d = new Date(e.expenseDate);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map[key])
        map[key] = {
          month: MONTH_NAMES[d.getMonth()],
          amount: 0,
          _ts: d.getFullYear() * 100 + d.getMonth(),
        };
      map[key].amount += Number(e.amount || 0);
    });
    return Object.values(map).sort((a, b) => a._ts - b._ts).slice(-6);
  }, [expenses]);

  const expenseBreakdown = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const cat = e.category || "Others";
      map[cat] = (map[cat] || 0) + Number(e.amount || 0);
    });
    return Object.entries(map)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const savingsTrend = useMemo(() => {
    if (!savings.length) return [];
    const sorted = [...savings]
      .filter((s) => s.savingDate)
      .sort((a, b) => new Date(a.savingDate) - new Date(b.savingDate));
    let cum = 0;
    return sorted.map((s) => {
      cum += Number(s.amount || 0);
      return { date: s.savingDate, amount: cum };
    });
  }, [savings]);

  const investmentTrend = useMemo(() => {
    const map = {};
    investments.forEach((inv) => {
      if (!inv.investmentDate) return;
      const d = new Date(inv.investmentDate);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map[key])
        map[key] = {
          month: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
          investedAmount: 0,
          currentValue: 0,
          _ts: d.getFullYear() * 100 + d.getMonth(),
        };
      map[key].investedAmount += Number(inv.investedAmount || 0);
      map[key].currentValue += Number(inv.currentValue || 0);
    });
    return Object.values(map).sort((a, b) => a._ts - b._ts);
  }, [investments]);

  /* ── Computed stats ── */
  const totalSavings =
    dashboard?.currentSavings ?? savings.reduce((s, e) => s + Number(e.amount || 0), 0);
  const monthlyExpenses =
    dashboard?.monthlyExpenses ?? expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const investmentValue =
    dashboard?.investmentValue ?? investments.reduce((s, e) => s + Number(e.currentValue || 0), 0);
  const netGrowth =
    dashboard?.netGrowth ??
    investmentValue - investments.reduce((s, e) => s + Number(e.investedAmount || 0), 0);

  /* ── Loading / Error states ── */
  if (loading) {
    return (
      <div className="flex" style={{ minHeight: "100vh" }}>
        <FinanceSidebar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading finance data…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex" style={{ minHeight: "100vh" }}>
        <FinanceSidebar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <span className="text-5xl mb-4 block">⚠️</span>
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={loadAll}
              className="mt-4 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50" style={{ minHeight: "100vh" }}>
      <FinanceSidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Finance Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track savings, expenses and investments at a glance.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <FinanceStats title="Current Savings" value={`₹${Number(totalSavings).toLocaleString()}`} />
          <FinanceStats title="Monthly Expenses" value={`₹${Number(monthlyExpenses).toLocaleString()}`} />
          <FinanceStats title="Investment Value" value={`₹${Number(investmentValue).toLocaleString()}`} />
          <FinanceStats title="Net Growth" value={`₹${Number(netGrowth).toLocaleString()}`} />
        </div>

        {/* Charts — Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {expenseChartData.length > 0 ? (
            <ChartBox title="📅 Monthly Expenses">
              <BarChart data={expenseChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v.toLocaleString()}`} />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="amount" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartBox>
          ) : (
            <EmptyChart title="📅 Monthly Expenses" icon="📊" />
          )}

          {expenseBreakdown.length > 0 ? (
            <ChartBox title="🍩 Expense Breakdown">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  innerRadius={45}
                  paddingAngle={3}
                  label={({ category, percent }) =>
                    `${category} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {expenseBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ChartBox>
          ) : (
            <EmptyChart title="🍩 Expense Breakdown" icon="🥧" />
          )}
        </div>

        {/* Charts — Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {savingsTrend.length > 0 ? (
            <ChartBox title="📈 Savings Trend">
              <LineChart data={savingsTrend} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v.toLocaleString()}`} />
                <Tooltip content={<LineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Savings"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#10b981" }}
                  activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ChartBox>
          ) : (
            <EmptyChart title="📈 Savings Trend" icon="💰" />
          )}

          {investmentTrend.length > 0 ? (
            <ChartBox title="🚀 Investment Growth">
              <LineChart data={investmentTrend} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v.toLocaleString()}`} />
                <Tooltip content={<LineTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="investedAmount" name="Invested" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, fill: "#3b82f6" }} />
                <Line type="monotone" dataKey="currentValue" name="Current Value" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3, fill: "#22c55e" }} />
              </LineChart>
            </ChartBox>
          ) : (
            <EmptyChart title="🚀 Investment Growth" icon="📈" />
          )}
        </div>
      </div>
    </div>
  );
}