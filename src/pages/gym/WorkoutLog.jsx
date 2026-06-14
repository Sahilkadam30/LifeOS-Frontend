import { useEffect, useState } from "react";
import {
  getWorkouts,
  createWorkout,
  deleteWorkout
} from "../../services/gymService";
import GymSidebar from "../../components/gym/GymSidebar";
import SuccessModal from "../../components/SuccessModal";
import { Calendar, Clock, Dumbbell, Tag, Target, Trash2 } from "lucide-react";

export default function WorkoutLog() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    workoutName: "",
    workoutType: "",
    muscleGroup: "",
    durationMinutes: "",
    workoutDate: ""
  });

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const res = await getWorkouts();
      setWorkouts(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const saveWorkout = async (e) => {
    e.preventDefault();
    if (!form.workoutName || !form.workoutDate || !form.durationMinutes) {
      alert("Please fill in Workout Name, Date, and Duration.");
      return;
    }

    try {
      await createWorkout(form);
      setForm({
        workoutName: "",
        workoutType: "",
        muscleGroup: "",
        durationMinutes: "",
        workoutDate: ""
      });
      setShowSuccess(true);
      loadWorkouts();
    } catch (error) {
      console.log(error);
    }
  };

  const removeWorkout = async (id) => {
    if (confirm("Are you sure you want to delete this workout?")) {
      try {
        await deleteWorkout(id);
        loadWorkouts();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-['Inter',_sans-serif] flex">
      <GymSidebar />

      <div className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight leading-none mb-2">
              Workout Log
            </h1>
            <p className="text-[#64748B] text-[15px]">
              Record training sessions, categorize movements, and track duration history.
            </p>
          </div>
        </div>

        {/* LOG WORKOUT FORM CARD */}
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm mb-8">
          <h2 className="text-[20px] font-semibold text-[#1E293B] mb-5 flex items-center gap-2">
            <Dumbbell size={20} className="text-[#2563EB]" />
            Log New Session
          </h2>

          <form onSubmit={saveWorkout}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Workout Name *
                </label>
                <input
                  className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                  placeholder="e.g. Upper Body Pump, Running"
                  value={form.workoutName}
                  onChange={(e) =>
                    setForm({ ...form, workoutName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Workout Type
                </label>
                <input
                  className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                  placeholder="e.g. Strength, Cardio, HIIT"
                  value={form.workoutType}
                  onChange={(e) =>
                    setForm({ ...form, workoutType: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Date *
                </label>
                <input
                  type="date"
                  className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                  value={form.workoutDate}
                  onChange={(e) =>
                    setForm({ ...form, workoutDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Muscle Group
                </label>
                <input
                  className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                  placeholder="e.g. Chest, Quads, Full Body"
                  value={form.muscleGroup}
                  onChange={(e) =>
                    setForm({ ...form, muscleGroup: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Duration (Minutes) *
                </label>
                <input
                  type="number"
                  className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                  placeholder="e.g. 45"
                  value={form.durationMinutes}
                  onChange={(e) =>
                    setForm({ ...form, durationMinutes: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex items-end pt-1">
                <button
                  type="submit"
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3 rounded-[10px] text-[15px] shadow-sm hover:shadow transition-all duration-200 h-[46px]"
                >
                  Save Workout Session
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* WORKOUTS HISTORY LIST CARD */}
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="text-[20px] font-semibold text-[#1E293B] mb-5 border-b border-[#F1F5F9] pb-3">
            Session History
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2563EB]"></div>
            </div>
          ) : workouts.length === 0 ? (
            <div className="text-center py-12 text-[#888]">
              <p className="text-sm">No workouts logged yet. Start by logging a session above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] text-[12px] font-semibold uppercase tracking-wider">
                    <th className="pb-3 px-4">Workout</th>
                    <th className="pb-3 px-4">Type</th>
                    <th className="pb-3 px-4">Muscle Group</th>
                    <th className="pb-3 px-4 text-center">Duration</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]/40">
                  {workouts.map((w) => (
                    <tr
                      key={w.id}
                      className="hover:bg-[#F8FAFC] transition duration-150"
                    >
                      <td className="py-3.5 px-4 text-[14px] font-semibold text-[#1E293B] capitalize">
                        {w.workoutName}
                      </td>
                      <td className="py-3.5 px-4 text-[14px] text-[#334155]">
                        {w.workoutType ? (
                          <span className="inline-flex items-center gap-1 bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/10 px-2 py-0.5 rounded-[6px] text-[11px] font-bold uppercase tracking-wider">
                            {w.workoutType}
                          </span>
                        ) : (
                          <span className="text-[#94A3B8]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[14px] text-[#334155]">
                        {w.muscleGroup ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Target size={13} className="text-[#94A3B8]" />
                            {w.muscleGroup}
                          </span>
                        ) : (
                          <span className="text-[#94A3B8]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[14px] text-[#1E293B] font-semibold text-center">
                        <span className="inline-flex items-center gap-1 bg-[#E7F6EC] px-2.5 py-0.5 rounded-[6px] text-[#16A34A] border border-[#16A34A]/10 text-[12px]">
                          <Clock size={13} className="text-[#16A34A]" />
                          {w.durationMinutes}m
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[14px] text-[#334155]">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#94A3B8]" />
                          {w.workoutDate}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[14px] text-right">
                        <button
                          onClick={() => removeWorkout(w.id)}
                          className="text-[#94A3B8] hover:text-[#EF4444] p-1.5 rounded-full hover:bg-[#FDECEC] transition duration-150 cursor-pointer inline-flex items-center justify-center"
                          title="Delete workout"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Workout Logged!"
        description="Your workout session has been logged successfully."
      />
    </div>
  );
}