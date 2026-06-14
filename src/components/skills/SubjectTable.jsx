const statusColor = {
  NOT_STARTED: "bg-slate-100 text-slate-600",
  IN_PROGRESS:  "bg-blue-100 text-blue-700",
  COMPLETED:    "bg-emerald-100 text-emerald-700",
  ON_HOLD:      "bg-amber-100 text-amber-700",
};

export default function SubjectTable({ subjects = [], onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2E8F0]">
        <h2 className="text-base font-bold text-[#0F172A]">Subjects</h2>
      </div>

      {subjects.length === 0 ? (
        <div className="p-10 text-center text-sm text-[#94A3B8]">No subjects added yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC]">
              <tr>
                {["Name", "Status", "Start Date", "Target Date", ""].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {subjects.map((s) => (
                <tr key={s.id} className="hover:bg-[#F8FAFC] transition">
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{s.subjectName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[s.status] || "bg-slate-100 text-slate-600"}`}>
                      {s.status?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#64748B]">{s.startDate || "—"}</td>
                  <td className="px-6 py-4 text-[#64748B]">{s.targetDate || "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(s.id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}