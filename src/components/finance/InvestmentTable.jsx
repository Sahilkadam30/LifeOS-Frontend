const typeColors = {
  MUTUAL_FUND: "bg-blue-100 text-blue-700",
  STOCK: "bg-purple-100 text-purple-700",
  FD: "bg-amber-100 text-amber-700",
  GOLD: "bg-yellow-100 text-yellow-700",
  ETF: "bg-indigo-100 text-indigo-700",
  CRYPTO: "bg-orange-100 text-orange-700",
  OTHER: "bg-gray-100 text-gray-700",
};

const typeLabels = {
  MUTUAL_FUND: "Mutual Fund",
  STOCK: "Stock",
  FD: "Fixed Deposit",
  GOLD: "Gold",
  ETF: "ETF",
  CRYPTO: "Crypto",
  OTHER: "Other",
};

export default function InvestmentTable({ investments = [], onDelete, onEdit }) {
  const totalInvested = investments.reduce(
    (sum, i) => sum + Number(i.investedAmount || 0),
    0
  );
  const totalCurrent = investments.reduce(
    (sum, i) => sum + Number(i.currentValue || 0),
    0
  );
  const totalProfit = totalCurrent - totalInvested;

  if (investments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h5 className="text-base font-semibold text-gray-700 mb-4">
          Investment Portfolio
        </h5>
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <span className="text-4xl mb-3">📈</span>
          <p className="text-sm">No investments found. Start building your portfolio!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h5 className="text-base font-semibold text-gray-700">
          Investment Portfolio
        </h5>
        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
          {investments.length} Investment{investments.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Type", "Invested", "Current Value", "Profit/Loss", "Date", "Notes", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {investments.map((inv) => {
              const profit =
                Number(inv.currentValue || 0) - Number(inv.investedAmount || 0);
              const isPositive = profit >= 0;
              return (
                <tr
                  key={inv.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {inv.investmentName}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        typeColors[inv.investmentType] || typeColors.OTHER
                      }`}
                    >
                      {typeLabels[inv.investmentType] || inv.investmentType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    ₹{Number(inv.investedAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    ₹{Number(inv.currentValue || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-bold ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? "+" : ""}₹{profit.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {inv.investmentDate}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">
                    {inv.notes || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(inv)}
                          className="px-3 py-1 text-xs font-semibold text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors duration-150"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(inv.id)}
                        className="px-3 py-1 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-150"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Footer Summary */}
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td
                colSpan="2"
                className="px-4 py-3 text-xs font-bold text-gray-600 uppercase"
              >
                Portfolio Summary
              </td>
              <td className="px-4 py-3 font-bold text-gray-800 text-sm">
                ₹{totalInvested.toLocaleString()}
              </td>
              <td className="px-4 py-3 font-bold text-gray-800 text-sm">
                ₹{totalCurrent.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`font-bold text-sm ${
                    totalProfit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalProfit >= 0 ? "+" : ""}₹{totalProfit.toLocaleString()}
                </span>
              </td>
              <td colSpan="3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}