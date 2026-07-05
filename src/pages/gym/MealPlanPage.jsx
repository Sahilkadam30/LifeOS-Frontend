import { useEffect, useState } from "react";
import GymSidebar from "../../components/gym/GymSidebar";
import SuccessModal from "../../components/SuccessModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { getMeals, createMeal, deleteMeal } from "../../services/gymService";
import { UtensilsCrossed, Trash2, Plus } from "lucide-react";

const DAY_OPTIONS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

const MEAL_TYPE_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Snack", "Pre-Workout", "Post-Workout"];

export default function MealPlanPage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState(null);
  const [form, setForm] = useState({
    dayName: "",
    mealType: "",
    mealDescription: "",
  });

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      setLoading(true);
      const res = await getMeals();
      setMeals(res.data || []);
    } catch (error) {
      console.error("Failed to load meals:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveMeal = async (e) => {
    e.preventDefault();
    if (!form.dayName || !form.mealType || !form.mealDescription) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      setSaving(true);
      await createMeal(form);
      setForm({ dayName: "", mealType: "", mealDescription: "" });
      setShowSuccess(true);
      loadMeals();
    } catch (error) {
      console.error("Failed to save meal:", error);
    } finally {
      setSaving(false);
    }
  };

  const removeMeal = (id) => {
    setMealToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!mealToDelete) return;
    try {
      await deleteMeal(mealToDelete);
      loadMeals();
    } catch (error) {
      console.error("Failed to delete meal:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setMealToDelete(null);
    }
  };

  // Group meals by day for a nicer view
  const groupedMeals = DAY_OPTIONS.reduce((acc, day) => {
    const dayMeals = meals.filter(
      (m) => m.dayName?.toLowerCase() === day.toLowerCase()
    );
    if (dayMeals.length > 0) acc[day] = dayMeals;
    return acc;
  }, {});

  const mealTypeColor = (type) => {
    const map = {
      Breakfast: "bg-amber-50 text-amber-700 border-amber-200/60",
      Lunch: "bg-sky-50 text-sky-700 border-sky-200/60",
      Dinner: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
      Snack: "bg-pink-50 text-pink-700 border-pink-200/60",
      "Pre-Workout": "bg-orange-50 text-orange-700 border-orange-200/60",
      "Post-Workout": "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    };
    return map[type] || "bg-gray-50 text-gray-700 border-gray-200/60";
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-['Inter',_sans-serif] flex">
      <GymSidebar />

      <div className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight leading-none mb-2">
              Meal Planner
            </h1>
            <p className="text-[#64748B] text-[15px]">
              Plan and schedule nutrition goals, snacks, and workout fuel.
            </p>
          </div>

          <div className="flex gap-3">
            <span className="bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/10 px-3.5 py-2 rounded-[10px] text-[13px] font-bold uppercase tracking-wider">
              {meals.length} Meal{meals.length !== 1 ? "s" : ""} Scheduled
            </span>
          </div>
        </div>

        {/* ADD MEAL FORM CARD */}
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm mb-8">
          <h2 className="text-[20px] font-semibold text-[#1E293B] mb-5 flex items-center gap-2">
            <Plus size={20} className="text-[#2563EB]" />
            Add Scheduled Meal
          </h2>

          <form onSubmit={saveMeal}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Day */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Day *
                </label>
                <select
                  className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B] cursor-pointer"
                  value={form.dayName}
                  onChange={(e) => setForm({ ...form, dayName: e.target.value })}
                  required
                >
                  <option value="">Select day…</option>
                  {DAY_OPTIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Meal Type */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Meal Type *
                </label>
                <select
                  className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B] cursor-pointer"
                  value={form.mealType}
                  onChange={(e) => setForm({ ...form, mealType: e.target.value })}
                  required
                >
                  <option value="">Select type…</option>
                  {MEAL_TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Meal Description *
                </label>
                <input
                  className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-2.5 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                  placeholder="e.g. 3 Eggs, oats with protein shake"
                  value={form.mealDescription}
                  onChange={(e) => setForm({ ...form, mealDescription: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-[10px] font-medium text-[15px] shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving…" : "Save Scheduled Meal"}
              </button>
            </div>
          </form>
        </div>

        {/* MEALS LIST */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2563EB]"></div>
          </div>
        ) : meals.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-12 text-center shadow-sm">
            <UtensilsCrossed size={40} className="text-[#94A3B8] mx-auto mb-3 opacity-50" />
            <p className="text-[#64748B] text-[15px]">
              No meals planned yet. Add your first meal above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Object.entries(groupedMeals).map(([day, dayMeals]) => (
              <div
                key={day}
                className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-[18px] font-bold text-[#1E293B] mb-4 border-b border-[#F1F5F9] pb-2">
                    {day}
                  </h2>
                  <div className="space-y-3">
                    {dayMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="group bg-[#F8FAFC] border border-[#E2E8F0]/40 hover:bg-[#F1F5F9] transition-all duration-200 rounded-[10px] p-3.5 flex items-start justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <span
                            className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-[6px] border uppercase tracking-wider mb-2 ${mealTypeColor(meal.mealType)}`}
                          >
                            {meal.mealType}
                          </span>
                          <p className="text-[14px] font-medium text-[#334155] leading-normal">
                            {meal.mealDescription}
                          </p>
                        </div>
                        <button
                          onClick={() => removeMeal(meal.id)}
                          className="shrink-0 text-[#94A3B8] hover:text-[#EF4444] p-1.5 rounded-full hover:bg-slate-200/40 transition duration-150 cursor-pointer mt-0.5"
                          title="Delete meal"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Meal Saved!"
        description="Your scheduled meal has been added successfully."
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setMealToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Scheduled Meal?"
        description="Are you sure you want to delete this scheduled meal? This action cannot be undone."
      />
    </div>
  );
}