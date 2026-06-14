import { NotebookText } from "lucide-react";

export default function JournalList({ journals = [], onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2E8F0]">
        <h2 className="text-base font-bold text-[#0F172A]">Journal Entries</h2>
      </div>

      {journals.length === 0 ? (
        <div className="p-10 text-center text-sm text-[#94A3B8]">No journal entries yet. Start writing!</div>
      ) : (
        <div className="divide-y divide-[#F1F5F9]">
          {journals.map((j) => (
            <div key={j.id} className="px-6 py-5 hover:bg-[#F8FAFC] transition">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <NotebookText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#0F172A] text-sm">{j.title}</h3>
                  <p className="text-[#334155] text-sm mt-1 leading-relaxed">{j.learnedToday}</p>
                  {j.notes && <p className="text-[#64748B] text-xs mt-1 italic">{j.notes}</p>}
                  {j.createdAt && (
                    <p className="text-[#94A3B8] text-xs mt-2">
                      {new Date(j.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </p>
                  )}
                </div>
                {onDelete && (
                  <button
                    onClick={() => onDelete(j.id)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition flex-shrink-0"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}