export default function StudySessionTable({ sessions = [], onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2E8F0]">
        <h2 className="text-base font-bold text-[#0F172A]">Study Sessions</h2>
      </div>

      {sessions.length === 0 ? (
        <div className="p-10 text-center text-sm text-[#94A3B8]">No sessions logged yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC]">
              <tr>
                {["Subject", "Hours", "Date", "Notes", ""].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-[#F8FAFC] transition">
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{s.subjectName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      {s.hoursStudied}h
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#64748B]">{s.studyDate || "—"}</td>
                  <td className="px-6 py-4 text-[#64748B] max-w-xs truncate">{s.notes || "—"}</td>
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