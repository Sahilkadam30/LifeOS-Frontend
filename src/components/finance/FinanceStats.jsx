const colorMap = {
  "Current Savings": {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: "💰",
    border: "border-green-200",
  },
  "Monthly Expenses": {
    bg: "bg-red-50",
    text: "text-red-600",
    icon: "💸",
    border: "border-red-200",
  },
  "Investment Value": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: "📈",
    border: "border-blue-200",
  },
  "Net Growth": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    icon: "🚀",
    border: "border-purple-200",
  },
};

export default function FinanceStats({ title, value }) {
  const colors = colorMap[title] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    icon: "📊",
    border: "border-gray-200",
  };

  return (
    <div
      className={`rounded-xl border ${colors.border} ${colors.bg} p-5 flex flex-col gap-2 shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {title}
        </span>
        <span className="text-2xl">{colors.icon}</span>
      </div>
      <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
    </div>
  );
}