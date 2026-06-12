import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/finance/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/finance/expenses", icon: "💳", label: "Expense Tracker" },
  { to: "/finance/savings", icon: "🏦", label: "Savings Tracker" },
  { to: "/finance/investments", icon: "📈", label: "Investment Tracker" },
];

export default function FinanceSidebar() {
  const location = useLocation();

  return (
    <div
      className="bg-gray-900 text-white flex flex-col"
      style={{ width: "240px", minHeight: "100vh", flexShrink: 0 }}
    >
      {/* Brand */}
      <div className="px-6 py-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-green-400">💰 Finance</h2>
        <p className="text-xs text-gray-400 mt-1">Money Manager</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}