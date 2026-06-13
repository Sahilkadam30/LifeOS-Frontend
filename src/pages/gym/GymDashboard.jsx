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
    <div className="min-h-screen bg-[#F5F7FA] font-['Inter',_sans-serif] flex">
      {/* SIDEBAR */}
      <GymSidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight leading-none mb-2">
              Fitness Hub
            </h1>
            <p className="text-[#64748B] text-[15px]">
              Track your streaks, log workouts, and optimize your weekly meal planner.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563EB]"></div>
          </div>
        ) : (
          dashboard && (
            <div className="space-y-8">
              {/* STAT CARDS */}
              <DashboardCards
                streak={dashboard.workoutStreak}
                monthlyCount={dashboard.monthlyWorkoutCount}
                goalsCount={dashboard.activeGoalsCount}
              />

              {/* GRID FOR WORKOUTS & MEALS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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