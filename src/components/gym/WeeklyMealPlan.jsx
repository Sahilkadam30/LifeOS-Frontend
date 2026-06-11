import { Apple } from "lucide-react";

export default function WeeklyMealPlan({ meals }) {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#ECECEC] flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#222] flex items-center gap-2">
          <Apple size={22} className="text-[#059669]" />
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
              className="flex items-center justify-between bg-[#F8F6F4] hover:bg-[#F0EDEA] transition-all duration-200 rounded-2xl p-4 gap-4"
            >
              <span className="bg-[#E6F4EA] text-[#059669] px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 shadow-sm shadow-emerald-50">
                {meal.dayName}
              </span>

              <span className="text-[#444] text-sm font-medium text-right break-words max-w-[70%]">
                {meal.mealDescription}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}