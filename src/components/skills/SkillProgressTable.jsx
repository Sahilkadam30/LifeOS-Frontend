const levelColor = {
  BEGINNER:     "bg-slate-100 text-slate-600",
  INTERMEDIATE: "bg-blue-100 text-blue-700",
  ADVANCED:     "bg-violet-100 text-violet-700",
  EXPERT:       "bg-amber-100 text-amber-700",
};

export default function SkillProgressTable({ skills = [], onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2E8F0]">
        <h2 className="text-base font-bold text-[#0F172A]">Skill Progress</h2>
      </div>

      {skills.length === 0 ? (
        <div className="p-10 text-center text-sm text-[#94A3B8]">No skills tracked yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC]">
              <tr>
                {["Skill", "Progress", "Level", ""].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {skills.map((s) => (
                <tr key={s.id} className="hover:bg-[#F8FAFC] transition">
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{s.skillName}</td>
                  <td className="px-6 py-4 w-48">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#00C853] transition-all"
                          style={{ width: `${s.progressPercentage ?? 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B] w-10 text-right">
                        {s.progressPercentage ?? 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${levelColor[s.skillLevel] || levelColor.BEGINNER}`}>
                      {s.skillLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {onDelete && (
                      <button
                        onClick={() => onDelete(s.id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition"
                      >
                        Delete
                      </button>
                    )}
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