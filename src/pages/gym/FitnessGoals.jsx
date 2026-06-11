import { useEffect, useState } from "react";
import GymSidebar from "../../components/gym/GymSidebar";
import {
  getGoals,
  createGoal,
  deleteGoal,
  getHabits,
  createHabit,
  toggleHabit,
  deleteHabit,
} from "../../services/gymService";
import {
  Target,
  Trash2,
  CheckCircle2,
  Circle,
  Plus,
  CheckSquare,
  Square,
  Flame,
  Repeat2,
} from "lucide-react";

export default function FitnessGoals() {
  // ── Goals ──────────────────────────────────────────────
  const [goals, setGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [goalForm, setGoalForm] = useState({
    goalName: "",
    targetValue: "",
    deadline: "",
  });

  // ── Habits ─────────────────────────────────────────────
  const [habits, setHabits] = useState([]);
  const [loadingHabits, setLoadingHabits] = useState(true);
  const [habitInput, setHabitInput] = useState("");
  const [addingHabit, setAddingHabit] = useState(false);

  // ── Load on mount ──────────────────────────────────────
  useEffect(() => {
    loadGoals();
    loadHabits();
  }, []);

  // ── Goal handlers ──────────────────────────────────────
  const loadGoals = async () => {
    try {
      setLoadingGoals(true);
      const res = await getGoals();
      setGoals(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGoals(false);
    }
  };

  const saveGoal = async (e) => {
    e.preventDefault();
    if (!goalForm.goalName || !goalForm.targetValue) {
      alert("Please fill in Goal Name and Target Value.");
      return;
    }
    try {
      await createGoal(goalForm);
      setGoalForm({ goalName: "", targetValue: "", deadline: "" });
      loadGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const removeGoal = async (id) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await deleteGoal(id);
        loadGoals();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ── Habit handlers ─────────────────────────────────────
  const loadHabits = async () => {
    try {
      setLoadingHabits(true);
      const res = await getHabits();
      setHabits(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHabits(false);
    }
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!habitInput.trim()) return;
    try {
      setAddingHabit(true);
      await createHabit({ habitName: habitInput.trim() });
      setHabitInput("");
      loadHabits();
    } catch (err) {
      console.error(err);
    } finally {
      setAddingHabit(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleHabit(id);
      loadHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const removeHabit = async (id) => {
    try {
      await deleteHabit(id);
      loadHabits();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Derived ────────────────────────────────────────────
  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);
  const completedHabits = habits.filter((h) => h.completed).length;
  const completionPct =
    habits.length === 0
      ? 0
      : Math.round((completedHabits / habits.length) * 100);

  return (
    <div className="min-h-screen bg-[#F8F6F4] font-['Inter'] flex">
      <GymSidebar />

      <div className="flex-1 px-5 md:px-8 py-6 overflow-y-auto">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-['Playfair_Display'] font-bold text-[#222]">
              Fitness Goals
            </h1>
            <p className="text-[#777] text-sm mt-2">
              Set targets, track milestones, and build daily habits.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-[#ECECEC] text-sm font-semibold text-[#059669]">
              {activeGoals.length} Active Goal{activeGoals.length !== 1 ? "s" : ""}
            </div>
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-[#ECECEC] text-sm font-semibold text-[#555]">
              {completedGoals.length} Completed
            </div>
          </div>
        </div>

        {/* ── CREATE GOAL FORM ── */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#ECECEC] mb-8">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#222] mb-6 flex items-center gap-2">
            <Plus size={22} className="text-[#059669]" />
            Create New Goal
          </h2>

          <form onSubmit={saveGoal}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">
                  Goal Name *
                </label>
                <input
                  className="w-full bg-[#F8F6F4] rounded-2xl px-5 py-4 outline-none text-base border border-transparent focus:border-[#059669] focus:bg-white transition-all duration-200"
                  placeholder="e.g. Lose 5kg, Run 10km"
                  value={goalForm.goalName}
                  onChange={(e) => setGoalForm({ ...goalForm, goalName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">
                  Target Value *
                </label>
                <input
                  type="number"
                  className="w-full bg-[#F8F6F4] rounded-2xl px-5 py-4 outline-none text-base border border-transparent focus:border-[#059669] focus:bg-white transition-all duration-200"
                  placeholder="e.g. 5"
                  value={goalForm.targetValue}
                  onChange={(e) => setGoalForm({ ...goalForm, targetValue: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  className="w-full bg-[#F8F6F4] rounded-2xl px-5 py-4 outline-none text-base border border-transparent focus:border-[#059669] focus:bg-white transition-all duration-200"
                  value={goalForm.deadline}
                  onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                className="bg-[#059669] hover:bg-[#047857] text-white px-8 py-4 rounded-2xl text-base shadow-sm font-semibold transition hover:scale-[1.01] duration-200 cursor-pointer"
              >
                Save Goal
              </button>
            </div>
          </form>
        </div>

        {/* ── DAILY HABITS ── */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#ECECEC] mb-8">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#222] flex items-center gap-2">
                <Repeat2 size={22} className="text-[#059669]" />
                Daily Habits
              </h2>
              <p className="text-[#777] text-sm mt-1">
                Build consistency — check off each habit every day.
              </p>
            </div>

            {habits.length > 0 && (
              <div className="flex items-center gap-3 shrink-0">
                {/* Progress ring-style pill */}
                <div className="bg-[#ECFDF5] text-[#059669] px-5 py-2 rounded-2xl font-bold text-sm">
                  <Flame size={14} className="inline mr-1 mb-0.5" />
                  {completionPct}% Today
                </div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {habits.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-xs text-[#999] mb-1.5">
                <span>{completedHabits} of {habits.length} completed</span>
                <span>{completionPct}%</span>
              </div>
              <div className="w-full h-2 bg-[#F0EDEA] rounded-full overflow-hidden">
                <div
                  className="h-2 bg-[#059669] rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Add habit form */}
          <form onSubmit={addHabit} className="flex gap-3 mb-6">
            <input
              className="flex-1 bg-[#F8F6F4] rounded-2xl px-5 py-3.5 outline-none text-sm border border-transparent focus:border-[#059669] focus:bg-white transition-all duration-200"
              placeholder="Add a new habit… e.g. Drink 3L water, 30 min walk"
              value={habitInput}
              onChange={(e) => setHabitInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={addingHabit || !habitInput.trim()}
              className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white px-6 py-3.5 rounded-2xl text-sm font-semibold transition hover:scale-[1.01] duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Plus size={16} />
              Add
            </button>
          </form>

          {/* Habits list */}
          {loadingHabits ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#059669]" />
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-10 text-[#AAA]">
              <Repeat2 size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No habits added yet. Start building your routine above!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
                    habit.completed
                      ? "bg-[#ECFDF5] border border-[#D1F2DD]"
                      : "bg-[#F8F6F4] hover:bg-[#F0EDEA] border border-transparent"
                  }`}
                >
                  {/* Toggle + name */}
                  <button
                    onClick={() => handleToggle(habit.id)}
                    className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                  >
                    {habit.completed ? (
                      <CheckSquare size={22} className="text-[#059669] shrink-0" />
                    ) : (
                      <Square size={22} className="text-[#CCC] shrink-0" />
                    )}
                    <span
                      className={`text-sm font-medium transition-all duration-200 ${
                        habit.completed ? "line-through text-[#999]" : "text-[#222]"
                      }`}
                    >
                      {habit.habitName}
                    </span>
                    {habit.completed && (
                      <span className="ml-1 text-[10px] font-semibold text-[#059669] bg-white border border-[#D1F2DD] px-2 py-0.5 rounded-full">
                        Done ✓
                      </span>
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => removeHabit(habit.id)}
                    className="opacity-0 group-hover:opacity-100 shrink-0 text-red-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition duration-150 cursor-pointer ml-2"
                    title="Remove habit"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── GOALS LIST ── */}
        {loadingGoals ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#059669]" />
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 shadow-sm border border-[#ECECEC] text-center">
            <Target size={48} className="text-[#DDD] mx-auto mb-4" />
            <p className="text-[#888] text-base">
              No goals set yet. Create your first fitness goal above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* ACTIVE GOALS */}
            {activeGoals.length > 0 && (
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#ECECEC]">
                <h2 className="text-xl font-['Playfair_Display'] font-bold text-[#222] mb-5 flex items-center gap-2">
                  <Circle size={20} className="text-[#059669]" />
                  Active Goals
                </h2>
                <div className="space-y-4">
                  {activeGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="group bg-[#F8F6F4] hover:bg-[#F0EDEA] transition-all duration-200 rounded-2xl p-5 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-[#222] capitalize">
                          {goal.goalName}
                        </h3>
                        <div className="flex gap-3 mt-2 flex-wrap">
                          <span className="bg-white text-[#059669] border border-[#D1F2DD] px-3 py-0.5 rounded-full text-xs font-semibold">
                            Target: {goal.targetValue}
                          </span>
                          {goal.deadline && (
                            <span className="bg-white text-[#666] border border-[#ECECEC] px-3 py-0.5 rounded-full text-xs font-medium">
                              Due: {goal.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="shrink-0 text-red-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition duration-150 cursor-pointer"
                        title="Delete goal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMPLETED GOALS */}
            {completedGoals.length > 0 && (
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#ECECEC]">
                <h2 className="text-xl font-['Playfair_Display'] font-bold text-[#222] mb-5 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-[#059669]" />
                  Completed Goals
                </h2>
                <div className="space-y-4">
                  {completedGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="bg-[#E8F8EE] rounded-2xl p-5 flex items-center justify-between gap-4 opacity-80"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-[#059669] capitalize line-through">
                          {goal.goalName}
                        </h3>
                        <div className="flex gap-3 mt-2 flex-wrap">
                          <span className="bg-white text-[#059669] border border-[#D1F2DD] px-3 py-0.5 rounded-full text-xs font-semibold">
                            Target: {goal.targetValue}
                          </span>
                          {goal.deadline && (
                            <span className="bg-white text-[#666] border border-[#ECECEC] px-3 py-0.5 rounded-full text-xs font-medium">
                              Due: {goal.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="shrink-0 text-red-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition duration-150 cursor-pointer"
                        title="Delete goal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}