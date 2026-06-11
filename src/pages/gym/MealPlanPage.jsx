import { useEffect, useState } from "react";
import GymSidebar from "../../components/gym/GymSidebar";
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
      loadMeals();
    } catch (error) {
      console.error("Failed to save meal:", error);
    } finally {
      setSaving(false);
    }
  };

  const removeMeal = async (id) => {
    if (confirm("Delete this meal entry?")) {
      try {
        await deleteMeal(id);
        loadMeals();
      } catch (error) {
        console.error("Failed to delete meal:", error);
      }
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
      Breakfast: "bg-amber-50 text-amber-700 border-amber-200",
      Lunch: "bg-sky-50 text-sky-700 border-sky-200",
      Dinner: "bg-indigo-50 text-indigo-700 border-indigo-200",
      Snack: "bg-pink-50 text-pink-700 border-pink-200",
      "Pre-Workout": "bg-orange-50 text-orange-700 border-orange-200",
      "Post-Workout": "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    return map[type] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-[#F8F6F4] font-['Inter'] flex">
      <GymSidebar />

      <div className="flex-1 px-5 md:px-8 py-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-['Playfair_Display'] font-bold text-[#222]">
              Meal Planner
            </h1>
            <p className="text-[#777] text-sm mt-2">
              Plan your weekly nutrition and fuel your fitness journey.
            </p>
          </div>

          {/* STATS PILL */}
          <div className="flex gap-3 flex-wrap">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-[#ECECEC] text-sm font-semibold text-[#059669]">
              {meals.length} Meal{meals.length !== 1 ? "s" : ""} Planned
            </div>
          </div>
        </div>

        {/* ADD MEAL FORM CARD */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#ECECEC] mb-8">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#222] mb-6 flex items-center gap-2">
            <Plus size={22} className="text-[#059669]" />
            Add a Meal
          </h2>

          <form onSubmit={saveMeal}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Day */}
              <div>
                <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">
                  Day *
                </label>
                <select
                  className="w-full bg-[#F8F6F4] rounded-2xl px-5 py-4 outline-none text-base border border-transparent focus:border-[#059669] focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
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
              <div>
                <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">
                  Meal Type *
                </label>
                <select
                  className="w-full bg-[#F8F6F4] rounded-2xl px-5 py-4 outline-none text-base border border-transparent focus:border-[#059669] focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
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
              <div>
                <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">
                  Meal Description *
                </label>
                <input
                  className="w-full bg-[#F8F6F4] rounded-2xl px-5 py-4 outline-none text-base border border-transparent focus:border-[#059669] focus:bg-white transition-all duration-200"
                  placeholder="e.g. Oats with banana and honey"
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
                className="bg-[#059669] hover:bg-[#047857] text-white px-8 py-4 rounded-2xl text-base shadow-sm font-semibold transition hover:scale-[1.01] duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving…" : "Save Meal"}
              </button>
            </div>
          </form>
        </div>

        {/* MEALS LIST */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#059669]"></div>
          </div>
        ) : meals.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 shadow-sm border border-[#ECECEC] text-center">
            <UtensilsCrossed size={48} className="text-[#DDD] mx-auto mb-4" />
            <p className="text-[#888] text-base">
              No meals planned yet. Add your first meal above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Object.entries(groupedMeals).map(([day, dayMeals]) => (
              <div
                key={day}
                className="bg-white rounded-[32px] p-6 shadow-sm border border-[#ECECEC]"
              >
                <h2 className="text-xl font-['Playfair_Display'] font-bold text-[#222] mb-4">
                  {day}
                </h2>
                <div className="space-y-3">
                  {dayMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="group bg-[#F8F6F4] hover:bg-[#F0EDEA] transition-all duration-200 rounded-2xl p-4 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <span
                          className={`inline-block text-xs font-semibold px-3 py-0.5 rounded-full border mb-2 ${mealTypeColor(meal.mealType)}`}
                        >
                          {meal.mealType}
                        </span>
                        <p className="text-sm text-[#444] leading-snug">
                          {meal.mealDescription}
                        </p>
                      </div>
                      <button
                        onClick={() => removeMeal(meal.id)}
                        className="shrink-0 text-red-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition duration-150 cursor-pointer mt-0.5"
                        title="Delete meal"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}