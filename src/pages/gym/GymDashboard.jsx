import { useEffect, useState } from "react";
import GymSidebar from "../../components/gym/GymSidebar";
import DashboardCards from "../../components/gym/DashboardCards";
import RecentWorkouts from "../../components/gym/RecentWorkouts";
import WeeklyMealPlan from "../../components/gym/WeeklyMealPlan";
import { getDashboard } from "../../services/gymService";

export default function GymDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await getDashboard();
      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
              Fitness Dashboard
            </h1>
            <p className="text-[#777] text-sm mt-2">
              Track your energy, log your activities, and maintain a healthy meal plan.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#059669]"></div>
          </div>
        ) : (
          dashboard && (
            <div className="space-y-6">
              {/* STAT CARDS */}
              <DashboardCards
                streak={dashboard.workoutStreak}
                monthlyCount={dashboard.monthlyWorkoutCount}
                goalsCount={dashboard.activeGoalsCount}
              />

              {/* GRID FOR WORKOUTS & MEALS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentWorkouts workouts={dashboard.recentWorkouts} />
                <WeeklyMealPlan meals={dashboard.mealPlans} />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}