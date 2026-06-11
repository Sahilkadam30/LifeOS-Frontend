import { Calendar, Clock, Dumbbell } from "lucide-react";

export default function RecentWorkouts({ workouts }) {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#ECECEC] flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#222] flex items-center gap-2">
          <Dumbbell size={22} className="text-[#059669]" />
          Recent Workouts
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 max-h-[400px] pr-1">
        {!workouts || workouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-[#888]">
            <p className="text-sm">No recent workouts logged yet.</p>
          </div>
        ) : (
          workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-[#F8F6F4] hover:bg-[#F0EDEA] transition-all duration-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div>
                <h3 className="font-semibold text-base text-[#222] capitalize">
                  {workout.workoutName}
                </h3>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {workout.muscleGroup && (
                    <span className="bg-[#E6F4EA] text-[#059669] px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {workout.muscleGroup}
                    </span>
                  )}
                  {workout.workoutType && (
                    <span className="bg-[#EAEAEA] text-[#555] px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {workout.workoutType}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-[#777] text-xs font-medium shrink-0">
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-[#888]" />
                  {workout.workoutDate}
                </span>
                <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[#ECECEC]">
                  <Clock size={14} className="text-[#059669]" />
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