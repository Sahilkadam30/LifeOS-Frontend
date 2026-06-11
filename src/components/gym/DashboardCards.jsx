import { Flame, CalendarDays, Target } from "lucide-react";

export default function DashboardCards({ streak, monthlyCount, goalsCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* STREAK CARD */}
      <div className="bg-[#FFF2E6] border border-[#FFE0CC] rounded-3xl p-6 shadow-sm flex items-center gap-5 transition hover:scale-[1.02] duration-200">
        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-center shrink-0">
          <Flame size={32} className="text-orange-500" />
        </div>
        <div>
          <p className="text-[#666] text-xs font-semibold uppercase tracking-wider">
            Current Streak
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <h2 className="text-3xl font-bold text-[#222]">
              {streak ?? 0}
            </h2>
            <span className="text-sm text-[#777]">days</span>
          </div>
        </div>
      </div>

      {/* MONTHLY COUNT CARD */}
      <div className="bg-[#EAF5FF] border border-[#D0E7FF] rounded-3xl p-6 shadow-sm flex items-center gap-5 transition hover:scale-[1.02] duration-200">
        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-center shrink-0">
          <CalendarDays size={32} className="text-blue-500" />
        </div>
        <div>
          <p className="text-[#666] text-xs font-semibold uppercase tracking-wider">
            Monthly Workouts
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <h2 className="text-3xl font-bold text-[#222]">
              {monthlyCount ?? 0}
            </h2>
            <span className="text-sm text-[#777]">sessions</span>
          </div>
        </div>
      </div>

      {/* ACTIVE GOALS CARD */}
      <div className="bg-[#E8F8EE] border border-[#D1F2DD] rounded-3xl p-6 shadow-sm flex items-center gap-5 transition hover:scale-[1.02] duration-200">
        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-center shrink-0">
          <Target size={32} className="text-emerald-500" />
        </div>
        <div>
          <p className="text-[#666] text-xs font-semibold uppercase tracking-wider">
            Active Goals
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <h2 className="text-3xl font-bold text-[#222]">
              {goalsCount ?? 0}
            </h2>
            <span className="text-sm text-[#777]">goals</span>
          </div>
        </div>
      </div>
    </div>
  );
}