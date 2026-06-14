export default function ExpenseTable({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h5 className="text-base font-semibold text-gray-700 mb-4">Expenses</h5>
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <span className="text-4xl mb-3">💳</span>
          <p className="text-sm">No expenses found.</p>
        </div>
      </div>
    );
  }

  const categoryColors = {
    Food: "bg-orange-100 text-orange-700",
    Travel: "bg-blue-100 text-blue-700",
    Shopping: "bg-pink-100 text-pink-700",
    Bills: "bg-red-100 text-red-700",
    Entertainment: "bg-purple-100 text-purple-700",
    Education: "bg-indigo-100 text-indigo-700",
    Health: "bg-green-100 text-green-700",
    Others: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h5 className="text-base font-semibold text-gray-700">Expenses</h5>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Title", "Category", "Amount", "Date", "Action"].map((h) => (
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
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {expense.title}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      categoryColors[expense.category] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-red-600">
                  ₹{Number(expense.amount).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {expense.expenseDate}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onDelete(expense.id)}
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