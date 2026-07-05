import { useEffect, useState } from "react";
import SkillSidebar from "../../components/skills/SkillSidebar";
import SkillStats from "../../components/skills/SkillStats";
import StudyTrendChart from "../../components/skills/StudyTrendChart";
import SubjectProgressChart from "../../components/skills/SubjectProgressChart";
import {
  getSkillDashboard,
  getStudySessions,
  getSubjects,
} from "../../services/skillService";
import { BookOpen, Clock3, ListChecks, Trophy } from "lucide-react";

/**
 * Aggregate study-session records into a weekly "Study Hours Trend" series.
 * Produces an array of { week: "YYYY-Www", hours: number } sorted chronologically.
 */
function buildStudyTrend(sessions = []) {
  const weekMap = {};

  sessions.forEach((s) => {
    if (!s.studyDate) return;

    // ISO week calculation
    const d = new Date(s.studyDate);
    if (isNaN(d)) return;

    // Get ISO week number
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const dayIndex = (d.getDay() + 6) % 7; // Mon=0 … Sun=6
    const weekNum = Math.ceil(
      ((d - jan1) / 86400000 + jan1.getDay() + 1) / 7
    );
    const label = `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;

    weekMap[label] = (weekMap[label] || 0) + Number(s.hoursStudied || 0);
  });

  return Object.entries(weekMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, hours]) => ({ week, hours: parseFloat(hours.toFixed(1)) }));
}

/**
 * Aggregate study-session records into a per-subject "Subject Progress" series.
 * Produces an array of { subject: string, progress: number (total hours) }.
 */
function buildSubjectProgress(sessions = [], subjects = []) {
  // Build a map of total study hours per subject from sessions
  const hoursMap = {};

  sessions.forEach((s) => {
    const name = s.subjectName || "Unknown";
    hoursMap[name] = (hoursMap[name] || 0) + Number(s.hoursStudied || 0);
  });

  // Also include subjects that have zero hours (the user created but hasn't studied yet)
  subjects.forEach((sub) => {
    const name = sub.subjectName || sub.name;
    if (name && !(name in hoursMap)) {
      hoursMap[name] = 0;
    }
  });

  return Object.entries(hoursMap)
    .sort((a, b) => b[1] - a[1]) // highest hours first
    .map(([subject, progress]) => ({
      subject,
      progress: parseFloat(progress.toFixed(1)),
    }));
}

export default function SkillDashboard() {
  const [dashboard, setDashboard] = useState({});
  const [studyTrend, setStudyTrend] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      // Fire all three requests concurrently
      const [dashRes, sessionsRes, subjectsRes] = await Promise.allSettled([
        getSkillDashboard(),
        getStudySessions(),
        getSubjects(),
      ]);

      // Dashboard stats (counts)
      if (dashRes.status === "fulfilled") {
        setDashboard(dashRes.value.data || {});
      }

      const sessions =
        sessionsRes.status === "fulfilled" ? sessionsRes.value.data || [] : [];
      const subjects =
        subjectsRes.status === "fulfilled" ? subjectsRes.value.data || [] : [];

      // ── Build chart data client-side ──
      // Use the backend-provided aggregated data if available, otherwise compute
      const dashData =
        dashRes.status === "fulfilled" ? dashRes.value.data || {} : {};

      const trend =
        Array.isArray(dashData.studyHoursTrend) &&
        dashData.studyHoursTrend.length > 0
          ? dashData.studyHoursTrend
          : buildStudyTrend(sessions);

      const progress =
        Array.isArray(dashData.subjectProgress) &&
        dashData.subjectProgress.length > 0
          ? dashData.subjectProgress
          : buildSubjectProgress(sessions, subjects);

      setStudyTrend(trend);
      setSubjectProgress(progress);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
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
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2563EB]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StudyTrendChart data={studyTrend} />
            <SubjectProgressChart data={subjectProgress} />
          </div>
        )}
      </div>
    </div>
  );
}