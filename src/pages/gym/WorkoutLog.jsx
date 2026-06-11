import { useEffect, useState } from "react";
import {
  getWorkouts,
  createWorkout,
  deleteWorkout
} from "../../services/gymService";
import GymSidebar from "../../components/gym/GymSidebar";
import { Calendar, Clock, Dumbbell, Tag, Target, Trash2 } from "lucide-react";

export default function WorkoutLog() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
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
    <div className="min-h-screen bg-[#F8F6F4] font-['Inter'] flex">
      <GymSidebar />

      <div className="flex-1 px-5 md:px-8 py-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-['Playfair_Display'] font-bold text-[#222]">
              Workout Log
            </h1>
            <p className="text-[#777] text-sm mt-2">
              Log your physical training sessions and track your consistency.
            </p>
          </div>
        </div>

        {/* LOG WORKOUT FORM CARD */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#ECECEC] mb-8">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#222] mb-6 flex items-center gap-2">
            <Dumbbell size={22} className="text-[#059669]" />
            Log New Session
          </h2>

          <form onSubmit={saveWorkout}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">
                  Workout Name *
                </label>
                <input
                  className="w-full bg-[#F8F6F4] rounded-2xl px-5 py-4 outline-none text-base border border-transparent focus:border-[#059669] focus:bg-white transition-all duration-200"
                  placeholder="e.g. Morning Run, Upper Body"
                  value={form.workoutName}
                  onChange={(e) =>
                    setForm({ ...form, workoutName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">
                  Workout Type
                </label>
                <input
                  className="w-full bg-[#F8F6F4] rounded-2xl px-5 py-4 outline-none text-base border border-transparent focus:border-[#059669] focus:bg-white transition-all duration-200"
                  placeholder="e.g. Cardio, Strength, HIIT"
                  value={form.workoutType}
                  onChange={(e) =>
                    setForm({ ...form, workoutType: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  className="w-full bg-[#F8F6F4] rounded-2xl px-5 py-4 outline-none text-base border border-transparent focus:border-[#059669] focus:bg-white transition-all duration-200"
                  value={form.workoutDate}
                  onChange={(e) =>
                    setForm({ ...form, workoutDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">
                  Muscle Group
                </label>
                <input
                  className="w-full bg-[#F8F6F4] rounded-2xl px-5 py-4 outline-none text-base border border-transparent focus:border-[#059669] focus:bg-white transition-all duration-200"
                  placeholder="e.g. Chest, Legs, Full Body"
                  value={form.muscleGroup}
                  onChange={(e) =>
                    setForm({ ...form, muscleGroup: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">
                  Duration (Minutes) *
                </label>
                <input
                  type="number"
                  className="w-full bg-[#F8F6F4] rounded-2xl px-5 py-4 outline-none text-base border border-transparent focus:border-[#059669] focus:bg-white transition-all duration-200"
                  placeholder="e.g. 45"
                  value={form.durationMinutes}
                  onChange={(e) =>
                    setForm({ ...form, durationMinutes: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-[#059669] hover:bg-[#047857] text-white w-full py-4 rounded-2xl text-base shadow-sm font-semibold transition hover:scale-[1.01] duration-200 cursor-pointer h-[58px]"
                >
                  Save Workout
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* WORKOUTS HISTORY LIST CARD */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#ECECEC]">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#222] mb-6">
            Session History
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#059669]"></div>
            </div>
          ) : workouts.length === 0 ? (
            <div className="text-center py-12 text-[#888]">
              <p className="text-sm">No workouts logged yet. Start by logging a session above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#ECECEC] text-[#777] text-xs font-semibold uppercase tracking-wider">
                    <th className="pb-4 px-4">Workout</th>
                    <th className="pb-4 px-4">Type</th>
                    <th className="pb-4 px-4">Muscle Group</th>
                    <th className="pb-4 px-4 text-center">Duration</th>
                    <th className="pb-4 px-4">Date</th>
                    <th className="pb-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((w) => (
                    <tr
                      key={w.id}
                      className="border-b border-[#F8F6F4] hover:bg-[#F8F6F4]/50 transition duration-150"
                    >
                      <td className="py-4 px-4 text-sm font-semibold text-[#222] capitalize">
                        {w.workoutName}
                      </td>
                      <td className="py-4 px-4 text-sm text-[#555]">
                        {w.workoutType ? (
                          <span className="flex items-center gap-1.5">
                            <Tag size={14} className="text-[#888]" />
                            {w.workoutType}
                          </span>
                        ) : (
                          <span className="text-[#bbb]">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-[#555]">
                        {w.muscleGroup ? (
                          <span className="flex items-center gap-1.5">
                            <Target size={14} className="text-[#888]" />
                            {w.muscleGroup}
                          </span>
                        ) : (
                          <span className="text-[#bbb]">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-[#222] font-semibold text-center">
                        <span className="inline-flex items-center gap-1 bg-[#F8F6F4] px-2.5 py-1 rounded-lg border border-[#ECECEC]">
                          <Clock size={14} className="text-[#059669]" />
                          {w.durationMinutes}m
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#555]">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-[#888]" />
                          {w.workoutDate}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-right">
                        <button
                          onClick={() => removeWorkout(w.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition duration-150 cursor-pointer inline-flex items-center justify-center"
                          title="Delete workout"
                        >
                          <Trash2 size={16} />
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
    </div>
  );
}