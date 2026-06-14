import { Apple } from "lucide-react";

export default function WeeklyMealPlan({ meals }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-5 border-b border-[#F1F5F9] pb-3">
        <h2 className="text-[18px] font-bold text-[#1E293B] flex items-center gap-2">
          <Apple size={20} className="text-[#2563EB]" />
          Weekly Meal Plan
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 max-h-[400px] pr-1">
        {!meals || meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-[#888]">
            <p className="text-sm">No meal plans configured for this week.</p>
          </div>
        ) : (
          meals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0]/40 hover:bg-[#F1F5F9] transition-all duration-200 rounded-[10px] p-3.5 gap-4"
            >
              <span className="bg-[#E7F6EC] text-[#16A34A] border border-[#16A34A]/10 px-3.5 py-1.5 rounded-[8px] text-[12px] font-bold uppercase tracking-wider shrink-0 shadow-sm">
                {meal.dayName}
              </span>

              <span className="text-[#334155] text-[14px] font-medium text-right break-words max-w-[70%]">
                {meal.mealDescription}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}