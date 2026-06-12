const typeColors = {
  DAILY_SAVING: "bg-green-100 text-green-700",
  WEEKLY_SAVING: "bg-blue-100 text-blue-700",
  MONTHLY_SAVING: "bg-purple-100 text-purple-700",
  EMERGENCY_FUND: "bg-red-100 text-red-700",
};

const typeLabels = {
  DAILY_SAVING: "Daily",
  WEEKLY_SAVING: "Weekly",
  MONTHLY_SAVING: "Monthly",
  EMERGENCY_FUND: "Emergency",
};

export default function SavingsTable({ savings = [], onDelete }) {
  if (savings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h5 className="text-base font-semibold text-gray-700 mb-4">
          Savings History
        </h5>
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <span className="text-4xl mb-3">🏦</span>
          <p className="text-sm">No savings records yet. Start saving today!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h5 className="text-base font-semibold text-gray-700">
          Savings History
        </h5>
        <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
          {savings.length} Record{savings.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Amount", "Type", "Date", "Notes", "Action"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {savings.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-4 py-3 font-bold text-emerald-600">
                  ₹{Number(item.amount || 0).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      typeColors[item.savingType] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {typeLabels[item.savingType] || item.savingType}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{item.savingDate}</td>
                <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                  {item.notes || "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onDelete(item.id)}
                    className="px-3 py-1 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-150"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}