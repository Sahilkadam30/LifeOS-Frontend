import { Calendar, Clock, Dumbbell } from "lucide-react";

export default function RecentWorkouts({ workouts }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-5 border-b border-[#F1F5F9] pb-3">
        <h2 className="text-[18px] font-bold text-[#1E293B] flex items-center gap-2">
          <Dumbbell size={20} className="text-[#2563EB]" />
          Recent Workouts
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 max-h-[400px] pr-1">
        {!workouts || workouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-[#888]">
            <p className="text-sm">No recent workouts logged yet.</p>
          </div>
        ) : (
          workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-[#F8FAFC] border border-[#E2E8F0]/40 rounded-[10px] p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#F1F5F9] transition-all duration-200"
            >
              <div>
                <h3 className="font-semibold text-[14px] text-[#1E293B] capitalize">
                  {workout.workoutName}
                </h3>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  {workout.muscleGroup && (
                    <span className="bg-[#E7F6EC] text-[#16A34A] border border-[#16A34A]/10 px-2 py-0.5 rounded-[6px] text-[11px] font-bold uppercase tracking-wider">
                      {workout.muscleGroup}
                    </span>
                  )}
                  {workout.workoutType && (
                    <span className="bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/10 px-2 py-0.5 rounded-[6px] text-[11px] font-bold uppercase tracking-wider">
                      {workout.workoutType}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-[#64748B] text-[12px] font-semibold shrink-0">
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-[#94A3B8]" />
                  {workout.workoutDate}
                </span>
                <span className="flex items-center gap-1 bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-[6px] text-[#16A34A]">
                  <Clock size={13} className="text-[#16A34A]" />
                  {workout.durationMinutes} mins
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}