import { useEffect, useState } from "react";
import SkillSidebar from "../../components/skills/SkillSidebar";
import AchievementCard from "../../components/skills/AchievementCard";
import { getAchievements } from "../../services/skillService";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const res = await getAchievements();
      setAchievements(res.data);
    } catch (err) {
      console.error("Failed to load achievements", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <SkillSidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">Achievements</h1>
          <p className="text-sm text-[#64748B] mt-1">Celebrate your learning milestones</p>
        </div>

        {achievements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-16 text-center shadow-sm">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-[#64748B] text-sm">No achievements yet. Keep learning!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}