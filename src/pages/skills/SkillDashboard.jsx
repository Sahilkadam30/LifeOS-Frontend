import { useEffect, useState } from "react";
import SkillSidebar from "../../components/skills/SkillSidebar";
import SkillStats from "../../components/skills/SkillStats";
import StudyTrendChart from "../../components/skills/StudyTrendChart";
import SubjectProgressChart from "../../components/skills/SubjectProgressChart";
import { getSkillDashboard } from "../../services/skillService";
import { BookOpen, Clock3, ListChecks, Trophy } from "lucide-react";

export default function SkillDashboard() {
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getSkillDashboard();
      setDashboard(res.data);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <SkillSidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">Skill Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-1">Track your learning progress and achievements</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <SkillStats
            title="Subjects"
            value={dashboard.totalSubjects || 0}
            icon={<BookOpen size={22} />}
            color="blue"
          />
          <SkillStats
            title="Study Hours"
            value={dashboard.totalStudyHours || 0}
            icon={<Clock3 size={22} />}
            color="green"
          />
          <SkillStats
            title="Skills"
            value={dashboard.totalSkills || 0}
            icon={<ListChecks size={22} />}
            color="purple"
          />
          <SkillStats
            title="Achievements"
            value={dashboard.totalAchievements || 0}
            icon={<Trophy size={22} />}
            color="amber"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudyTrendChart data={dashboard.studyHoursTrend || []} />
          <SubjectProgressChart data={dashboard.subjectProgress || []} />
        </div>
      </div>
    </div>
  );
}