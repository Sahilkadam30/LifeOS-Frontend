import { Flame, CalendarDays, Target } from "lucide-react";

export default function DashboardCards({ streak, monthlyCount, goalsCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* STREAK CARD */}
      <div 
        className="bg-white border border-[#E2E8F0] border-t-4 border-[#F59E0B] rounded-[16px] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-5"
      >
        <div className="bg-[#FFF9EB] p-3.5 rounded-[12px] flex items-center justify-center shrink-0">
          <Flame size={28} className="text-[#F59E0B]" />
        </div>
        <div>
          <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider block">
            Current Streak
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <h2 className="text-[36px] font-bold text-[#1E293B] leading-none">
              {streak ?? 0}
            </h2>
            <span className="text-[14px] text-[#64748B] font-medium">days</span>
          </div>
        </div>
      </div>

      {/* MONTHLY COUNT CARD */}
      <div 
        className="bg-white border border-[#E2E8F0] border-t-4 border-[#2563EB] rounded-[16px] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-5"
      >
        <div className="bg-[#EAF2FF] p-3.5 rounded-[12px] flex items-center justify-center shrink-0">
          <CalendarDays size={28} className="text-[#2563EB]" />
        </div>
        <div>
          <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider block">
            Monthly Workouts
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <h2 className="text-[36px] font-bold text-[#1E293B] leading-none">
              {monthlyCount ?? 0}
            </h2>
            <span className="text-[14px] text-[#64748B] font-medium">sessions</span>
          </div>
        </div>
      </div>

      {/* ACTIVE GOALS CARD */}
      <div 
        className="bg-white border border-[#E2E8F0] border-t-4 border-[#16A34A] rounded-[16px] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-5"
      >
        <div className="bg-[#E7F6EC] p-3.5 rounded-[12px] flex items-center justify-center shrink-0">
          <Target size={28} className="text-[#16A34A]" />
        </div>
        <div>
          <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider block">
            Active Goals
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <h2 className="text-[36px] font-bold text-[#1E293B] leading-none">
              {goalsCount ?? 0}
            </h2>
            <span className="text-[14px] text-[#64748B] font-medium">goals</span>
          </div>
        </div>
      </div>
    </div>
  );
}