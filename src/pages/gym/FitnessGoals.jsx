import { useEffect, useState } from "react";
import GymSidebar from "../../components/gym/GymSidebar";
import SuccessModal from "../../components/SuccessModal";
import {
  getGoals,
  createGoal,
  updateGoal,
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
  const [showGoalSuccess, setShowGoalSuccess] = useState(false);
  const [goalForm, setGoalForm] = useState({
    goalName: "",
    targetValue: "",
    deadline: "",
  });

  // ── Habits ─────────────────────────────────────────────
  const [habits, setHabits] = useState([]);
  const [loadingHabits, setLoadingHabits] = useState(true);
  const [showHabitSuccess, setShowHabitSuccess] = useState(false);
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
      setShowGoalSuccess(true);
      loadGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleGoal = async (goal) => {
    try {
      await updateGoal(goal.id, {
        ...goal,
        completed: !goal.completed,
      });
      loadGoals();
    } catch (err) {
      console.error("Failed to toggle goal status:", err);
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
      setShowHabitSuccess(true);
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

  const removeHabit = async (e, id) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this daily habit?")) {
      try {
        await deleteHabit(id);
        loadHabits();
      } catch (err) {
        console.error(err);
      }
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
    <div className="min-h-screen bg-[#F5F7FA] font-['Inter',_sans-serif] flex">
      <GymSidebar />

      <div className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight leading-none mb-2">
              Fitness Goals
            </h1>
            <p className="text-[#64748B] text-[15px]">
              Set physical performance targets, monitor milestones, and track habits.
            </p>
          </div>

          <div className="flex gap-2.5">
            <span className="bg-[#E7F6EC] text-[#16A34A] border border-[#16A34A]/10 px-3.5 py-2 rounded-[10px] text-[13px] font-bold uppercase tracking-wider">
              {activeGoals.length} Active Target{activeGoals.length !== 1 ? "s" : ""}
            </span>
            <span className="bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/10 px-3.5 py-2 rounded-[10px] text-[13px] font-bold uppercase tracking-wider">
              {completedGoals.length} Completed
            </span>
          </div>
        </div>

        {/* CREATE GOAL FORM */}
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm mb-8">
          <h2 className="text-[20px] font-semibold text-[#1E293B] mb-5 flex items-center gap-2">
            <Plus size={20} className="text-[#2563EB]" />
            Create New Goal
          </h2>

          <form onSubmit={saveGoal}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Goal Name *
                </label>
                <input
                  className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                  placeholder="e.g. Run 10K, Bodyweight goal"
                  value={goalForm.goalName}
                  onChange={(e) => setGoalForm({ ...goalForm, goalName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Target Value *
                </label>
                <input
                  type="number"
                  className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                  placeholder="e.g. 10"
                  value={goalForm.targetValue}
                  onChange={(e) => setGoalForm({ ...goalForm, targetValue: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Deadline
                </label>
                <input
                  type="date"
                  className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                  value={goalForm.deadline}
                  onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-[10px] font-medium text-[15px] shadow-sm hover:shadow transition-all duration-200"
              >
                Save Goal
              </button>
            </div>
          </form>
        </div>

        {/* DAILY HABITS */}
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 border-b border-[#F1F5F9] pb-3">
            <div>
              <h2 className="text-[20px] font-semibold text-[#1E293B] flex items-center gap-2">
                <Repeat2 size={20} className="text-[#2563EB]" />
                Daily Habits
              </h2>
              <p className="text-[#64748B] text-[13px] mt-0.5">
                Build long-term routines by completing and checking habits daily.
              </p>
            </div>

            {habits.length > 0 && (
              <div className="bg-[#E7F6EC] text-[#16A34A] border border-[#16A34A]/10 px-3.5 py-1.5 rounded-[8px] text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-sm">
                <Flame size={14} className="fill-[#16A34A] text-[#16A34A]" />
                <span>{completionPct}% Complete</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {habits.length > 0 && (
            <div className="mb-6 bg-[#F8FAFC] p-4 rounded-[12px] border border-[#E2E8F0]/50">
              <div className="flex justify-between text-[12px] font-semibold text-[#64748B] mb-2.5">
                <span>{completedHabits} of {habits.length} habits completed</span>
                <span>{completionPct}%</span>
              </div>
              <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Add habit form */}
          <form onSubmit={addHabit} className="flex gap-3 mb-6">
            <input
              className="flex-1 bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-3 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
              placeholder="e.g. Drink 3L water, stretch for 15 minutes"
              value={habitInput}
              onChange={(e) => setHabitInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={addingHabit || !habitInput.trim()}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-[10px] font-medium text-[14px] transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center gap-1.5"
            >
              <Plus size={16} />
              Add Habit
            </button>
          </form>

          {/* Habits list */}
          {loadingHabits ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2563EB]" />
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-10 text-[#94A3B8]">
              <Repeat2 size={36} className="mx-auto mb-2.5 opacity-40 text-[#64748B]" />
              <p className="text-sm">No daily habits scheduled. Define something to track above.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className={`group flex items-center justify-between p-3.5 rounded-[10px] border transition-all duration-200 ${
                    habit.completed
                      ? "bg-[#E7F6EC] border-[#16A34A]/25"
                      : "bg-[#F8FAFC] border-[#E2E8F0]/40 hover:bg-[#F1F5F9]"
                  }`}
                >
                  {/* Toggle + name */}
                  <button
                    onClick={() => handleToggle(habit.id)}
                    className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                  >
                    {habit.completed ? (
                      <CheckSquare size={20} className="text-[#16A34A] shrink-0" />
                    ) : (
                      <Square size={20} className="text-[#94A3B8] shrink-0" />
                    )}
                    <span
                      className={`text-[14px] font-medium transition-all duration-200 ${
                        habit.completed ? "line-through text-[#64748B]" : "text-[#1E293B]"
                      }`}
                    >
                      {habit.habitName}
                    </span>
                    {habit.completed && (
                      <span className="ml-1.5 text-[10px] font-bold text-[#16A34A] bg-white border border-[#16A34A]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Done
                      </span>
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => removeHabit(e, habit.id)}
                    className="shrink-0 text-[#94A3B8] hover:text-[#EF4444] p-1.5 rounded-full hover:bg-slate-200/40 transition duration-150 cursor-pointer ml-2"
                    title="Remove habit"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GOALS LIST */}
        {loadingGoals ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2563EB]" />
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-12 text-center shadow-sm">
            <Target size={40} className="text-[#94A3B8] mx-auto mb-3 opacity-50" />
            <p className="text-[#64748B] text-[15px]">
              No goals set yet. Create your first fitness goal above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ACTIVE GOALS */}
            {activeGoals.length > 0 && (
              <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm">
                <h2 className="text-[18px] font-bold text-[#1E293B] mb-5 flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
                  <Circle size={18} className="text-[#2563EB]" />
                  Active Targets
                </h2>
                <div className="space-y-4">
                  {activeGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="group bg-[#F8FAFC] border border-[#E2E8F0]/40 hover:bg-[#F1F5F9] transition-all duration-200 rounded-[10px] p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Checkbox button to complete */}
                        <button
                          onClick={() => handleToggleGoal(goal)}
                          className="text-[#94A3B8] hover:text-[#2563EB] transition duration-150 shrink-0"
                          title="Mark completed"
                        >
                          <Circle size={18} />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[15px] text-[#1E293B] capitalize">
                            {goal.goalName}
                          </h3>
                          <div className="flex gap-2.5 mt-2 flex-wrap">
                            <span className="bg-white text-[#2563EB] border border-[#2563EB]/15 px-2.5 py-0.5 rounded-[6px] text-[11px] font-bold uppercase tracking-wider">
                              Target: {goal.targetValue}
                            </span>
                            {goal.deadline && (
                              <span className="bg-white text-[#64748B] border border-[#E2E8F0] px-2.5 py-0.5 rounded-[6px] text-[11px] font-bold uppercase tracking-wider">
                                Due: {goal.deadline}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="shrink-0 text-[#94A3B8] hover:text-[#EF4444] p-1.5 rounded-full hover:bg-slate-200/40 transition duration-150 cursor-pointer"
                        title="Delete goal"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMPLETED GOALS */}
            {completedGoals.length > 0 && (
              <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm">
                <h2 className="text-[18px] font-bold text-[#1E293B] mb-5 flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
                  <CheckCircle2 size={18} className="text-[#16A34A]" />
                  Completed Targets
                </h2>
                <div className="space-y-4">
                  {completedGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="group bg-[#E7F6EC] border border-[#16A34A]/25 rounded-[10px] p-4 flex items-center justify-between gap-4 opacity-90"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Checked button to toggle active again */}
                        <button
                          onClick={() => handleToggleGoal(goal)}
                          className="text-[#16A34A] hover:text-[#EF4444] transition duration-150 shrink-0"
                          title="Mark active"
                        >
                          <CheckCircle2 size={18} className="fill-[#16A34A]/10" />
                        </button>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[15px] text-[#16A34A] capitalize line-through">
                            {goal.goalName}
                          </h3>
                          <div className="flex gap-2.5 mt-2 flex-wrap">
                            <span className="bg-white text-[#16A34A] border border-[#16A34A]/20 px-2.5 py-0.5 rounded-[6px] text-[11px] font-bold uppercase tracking-wider">
                              Target: {goal.targetValue}
                            </span>
                            {goal.deadline && (
                              <span className="bg-white text-[#64748B] border border-[#E2E8F0] px-2.5 py-0.5 rounded-[6px] text-[11px] font-bold uppercase tracking-wider">
                                Due: {goal.deadline}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="shrink-0 text-[#94A3B8] hover:text-[#EF4444] p-1.5 rounded-full hover:bg-[#FDECEC] transition duration-150 cursor-pointer"
                        title="Delete goal"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <SuccessModal
        open={showGoalSuccess}
        onClose={() => setShowGoalSuccess(false)}
        title="Goal Saved!"
        description="Your fitness goal has been created successfully."
      />

      <SuccessModal
        open={showHabitSuccess}
        onClose={() => setShowHabitSuccess(false)}
        title="Habit Added!"
        description="Your daily fitness habit has been added successfully."
      />
    </div>
  );
}