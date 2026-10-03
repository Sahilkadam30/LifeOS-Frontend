import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiAward,
  FiCompass,
  FiLayers,
  FiZap,
  FiCheckCircle,
} from "react-icons/fi";
import LifeGoalsSidebar from "../../components/goals/LifeGoalsSidebar";
import LifeGoalsDashboardStats from "../../components/goals/LifeGoalsDashboardStats";
import GoalCard from "../../components/goals/GoalCard";
import GoalFormModal from "../../components/goals/GoalFormModal";
import GoalDetailModal from "../../components/goals/GoalDetailModal";
import GoalCelebrationModal from "../../components/goals/GoalCelebrationModal";
import GoalAchievementsModal from "../../components/goals/GoalAchievementsModal";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalStats,
  getGoalAchievements,
  updateGoalProgress,
  markGoalCompleted,
} from "../../services/goalService";

const INSPIRATIONAL_GOALS = [
  {
    title: "Cycle 50 km this week",
    description: "Complete a total cycling distance of 50 km this week to build stamina.",
    goalType: "SHORT_TERM",
    category: "FITNESS",
    priority: "HIGH",
    icon: "🚴",
  },
  {
    title: "Mountain Camping",
    description: "Go camping in the mountains, disconnect from tech, and sleep under the stars.",
    goalType: "LONG_TERM",
    category: "TRAVEL",
    priority: "HIGH",
    icon: "🏕️",
  },
  {
    title: "Learn a new language",
    description: "Master conversational fluency in Spanish or Japanese with 20 minutes daily practice.",
    goalType: "LONG_TERM",
    category: "EDUCATION",
    priority: "MEDIUM",
    icon: "🗣️",
  },
  {
    title: "Spend 2 hours without mobile",
    description: "Practice deep digital detox every Sunday morning.",
    goalType: "SHORT_TERM",
    category: "PERSONAL",
    priority: "MEDIUM",
    icon: "📵",
  },
  {
    title: "Create 20 paintings",
    description: "Build an art portfolio with 20 acrylic and oil canvas paintings.",
    goalType: "LONG_TERM",
    category: "HOBBY",
    priority: "MEDIUM",
    icon: "🎨",
  },
];

export default function LifeGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, SHORT_TERM, LONG_TERM, COMPLETED
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [celebrationGoal, setCelebrationGoal] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [goalsRes, statsRes, achRes] = await Promise.all([
        getGoals(),
        getGoalStats(),
        getGoalAchievements(),
      ]);
      setGoals(Array.isArray(goalsRes.data) ? goalsRes.data : []);
      setStats(statsRes.data || null);
      setAchievements(Array.isArray(achRes.data) ? achRes.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load goals data. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (formData) => {
    const res = await createGoal(formData);
    setGoals([res.data, ...goals]);
    loadStatsAndAchievements();
  };

  const handleUpdateGoal = async (formData) => {
    if (!selectedGoal) return;
    const res = await updateGoal(selectedGoal.id, formData);
    setGoals(goals.map((g) => (g.id === selectedGoal.id ? res.data : g)));
    setSelectedGoal(res.data);
    loadStatsAndAchievements();
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    await deleteGoal(goalId);
    setGoals(goals.filter((g) => g.id !== goalId));
    if (selectedGoal && selectedGoal.id === goalId) {
      setIsDetailModalOpen(false);
      setSelectedGoal(null);
    }
    loadStatsAndAchievements();
  };

  const handleQuickProgress = async (goal, newPercentage) => {
    try {
      const res = await updateGoalProgress(goal.id, newPercentage);
      setGoals(goals.map((g) => (g.id === goal.id ? res.data : g)));
      if (newPercentage === 100 && goal.status !== "COMPLETED") {
        setCelebrationGoal(res.data);
        setIsCelebrationOpen(true);
      }
      loadStatsAndAchievements();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoalUpdatedFromDetail = (updatedGoal) => {
    setGoals(goals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
    setSelectedGoal(updatedGoal);
    loadStatsAndAchievements();
  };

  const handleGoalCompletedCelebration = (goal) => {
    setCelebrationGoal(goal);
    setIsCelebrationOpen(true);
    loadStatsAndAchievements();
  };

  const loadStatsAndAchievements = async () => {
    try {
      const [statsRes, achRes] = await Promise.all([getGoalStats(), getGoalAchievements()]);
      setStats(statsRes.data || null);
      setAchievements(Array.isArray(achRes.data) ? achRes.data : []);
    } catch (e) {
      console.error("Error refreshing stats", e);
    }
  };

  // Filtered goals calculation
  const filteredGoals = goals.filter((g) => {
    // Horizon filter
    if (activeFilter === "SHORT_TERM" && g.goalType !== "SHORT_TERM") return false;
    if (activeFilter === "LONG_TERM" && g.goalType !== "LONG_TERM") return false;
    if (activeFilter === "COMPLETED" && g.status !== "COMPLETED") return false;

    // Category filter
    if (selectedCategory !== "ALL" && g.category !== selectedCategory) return false;

    // Status filter
    if (selectedStatus !== "ALL" && g.status !== selectedStatus) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = g.title?.toLowerCase().includes(q);
      const matchDesc = g.description?.toLowerCase().includes(q);
      const matchCategory = g.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCategory) return false;
    }

    return true;
  });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "'Inter', 'Manrope', sans-serif",
      }}
    >
      {/* Sidebar Navigation */}
      <LifeGoalsSidebar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        onOpenAddModal={() => {
          setSelectedGoal(null);
          setIsAddModalOpen(true);
        }}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        stats={stats}
      />

      {/* Main Workspace Area */}
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", minWidth: 0 }}>
        {/* Page Top Headline */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: "#EEF2FF",
                  color: "#4F46E5",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                <FiCompass /> Personal Roadmap
              </span>
            </div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: "#0F172A",
                margin: "0 0 6px",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Life Goals
            </h1>
            <p style={{ fontSize: 16, color: "#64748B", margin: 0, maxWidth: 600 }}>
              "What do I want to achieve in my life?" Map out short-term sprints and long-term
              destinations.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("open-lifeos-chat", {
                    detail: {
                      message: "Give me an overview of my life goals, milestones, and priority roadmap.",
                    },
                  })
                );
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 12,
                border: "1px solid rgba(99, 102, 241, 0.4)",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1))",
                color: "#4F46E5",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.2))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1))";
              }}
            >
              <span style={{ fontSize: 16 }}>✨</span>
              <span>Ask Goal AI</span>
            </button>

            <button
              onClick={() => setIsAchievementsOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 12,
                border: "1px solid #FDE68A",
                background: "#FEF3C7",
                color: "#B45309",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <FiAward style={{ fontSize: 18 }} />
              <span>Trophy Room</span>
            </button>

            <button
              onClick={() => {
                setSelectedGoal(null);
                setIsAddModalOpen(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #2563EB 0%, #10B981 100%)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 14,
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <FiPlus style={{ fontSize: 18, strokeWidth: 2.5 }} />
              <span>Create Goal</span>
            </button>
          </div>
        </div>

        {/* Top Dashboard Statistics */}
        <LifeGoalsDashboardStats stats={stats} />

        {/* AI Goal Coach Assistant Quick Prompts */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 14,
            padding: "12px 18px",
            marginBottom: 24,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🎯</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>
              Goal Coach AI (RAG):
            </span>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              Ask anything about your goals, milestones, or priorities:
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            {[
              { label: "📊 Goals Summary", prompt: "Summarize all my active life goals, their deadlines, and progress." },
              { label: "⚡ Next Milestones", prompt: "What are my upcoming pending milestones to complete next?" },
              { label: "🔥 High Priority", prompt: "Which high priority goals need my immediate focus right now?" },
              { label: "🏆 Achievements", prompt: "What goals and milestones have I successfully completed so far?" },
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("open-lifeos-chat", {
                      detail: { message: item.prompt, autoSend: true },
                    })
                  );
                }}
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #CBD5E1",
                  borderRadius: 20,
                  padding: "5px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#334155",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6366F1";
                  e.currentTarget.style.color = "#4F46E5";
                  e.currentTarget.style.background = "#EEF2FF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#CBD5E1";
                  e.currentTarget.style.color = "#334155";
                  e.currentTarget.style.background = "#F8FAFC";
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E2E8F0",
            padding: "16px 20px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Horizon tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { id: "ALL", label: "All Goals" },
              { id: "SHORT_TERM", label: "⚡ Short-Term" },
              { id: "LONG_TERM", label: "🏔️ Long-Term" },
              { id: "COMPLETED", label: "✅ Completed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: activeFilter === tab.id ? "#0F172A" : "#F1F5F9",
                  color: activeFilter === tab.id ? "#FFFFFF" : "#475569",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Dropdowns */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {/* Search Box */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#F8FAFC",
                border: "1px solid #CBD5E1",
                borderRadius: 10,
                padding: "8px 12px",
                width: 220,
              }}
            >
              <FiSearch style={{ color: "#94A3B8" }} />
              <input
                type="text"
                placeholder="Search goals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 13,
                  width: "100%",
                }}
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #CBD5E1",
                background: "#FFFFFF",
                fontSize: 13,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="ALL">All Categories</option>
              <option value="PERSONAL">🌱 Personal</option>
              <option value="HEALTH">❤️ Health</option>
              <option value="FITNESS">💪 Fitness</option>
              <option value="EDUCATION">📚 Education</option>
              <option value="CAREER">💼 Career</option>
              <option value="TRAVEL">✈️ Travel</option>
              <option value="HOBBY">🎨 Hobby</option>
              <option value="FINANCE">💰 Finance</option>
              <option value="RELATIONSHIP">🤝 Relationship</option>
              <option value="OTHER">✨ Other</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #CBD5E1",
                background: "#FFFFFF",
                fontSize: 13,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="NOT_STARTED">📝 Not Started</option>
              <option value="IN_PROGRESS">🔵 In Progress</option>
              <option value="PAUSED">⏸️ Paused</option>
              <option value="COMPLETED">✅ Completed</option>
              <option value="ABANDONED">❌ Abandoned</option>
            </select>
          </div>
        </div>

        {/* Loading / Error / Empty / Grid */}
        {error && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 14,
              padding: "16px 20px",
              color: "#DC2626",
              marginBottom: 24,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 300,
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                border: "4px solid #E2E8F0",
                borderTopColor: "#2563EB",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ color: "#64748B", fontSize: 15 }}>Loading your life roadmap…</p>
          </div>
        ) : filteredGoals.length === 0 ? (
          /* Empty State with Goal Inspiration Templates */
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 24,
              border: "1px solid #E2E8F0",
              padding: "48px 32px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 20,
                background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                margin: "0 auto 16px",
              }}
            >
              🧭
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>
              {goals.length === 0 ? "Begin Your Life Roadmap" : "No Goals Match Your Filter"}
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "#64748B",
                maxWidth: 480,
                margin: "0 auto 24px",
                lineHeight: 1.5,
              }}
            >
              {goals.length === 0
                ? "What do you want to accomplish next? Start with a quick sprint or set a big horizon dream."
                : "Try adjusting your search criteria or horizon filter to see your goals."}
            </p>

            {goals.length === 0 && (
              <div>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 14,
                  }}
                >
                  Quick Starter Inspiration (Click to Add):
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 12,
                    maxWidth: 820,
                    margin: "0 auto 28px",
                  }}
                >
                  {INSPIRATIONAL_GOALS.map((tpl) => (
                    <div
                      key={tpl.title}
                      onClick={() => {
                        setSelectedGoal(tpl);
                        setIsAddModalOpen(true);
                      }}
                      style={{
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        borderRadius: 14,
                        padding: "14px 16px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#93C5FD";
                        e.currentTarget.style.background = "#EFF6FF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#E2E8F0";
                        e.currentTarget.style.background = "#F8FAFC";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 18 }}>{tpl.icon}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>
                          {tpl.title}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 6,
                          background: tpl.goalType === "LONG_TERM" ? "#EEF2FF" : "#FEF3C7",
                          color: tpl.goalType === "LONG_TERM" ? "#4338CA" : "#B45309",
                        }}
                      >
                        {tpl.goalType === "LONG_TERM" ? "🏔️ Long Term" : "⚡ Short Term"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedGoal(null);
                setIsAddModalOpen(true);
              }}
              style={{
                padding: "12px 28px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #2563EB 0%, #10B981 100%)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 15,
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
                cursor: "pointer",
              }}
            >
              + Create Custom Goal
            </button>
          </div>
        ) : (
          /* Goals Grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 22,
            }}
          >
            {filteredGoals.map((g) => (
              <GoalCard
                key={g.id}
                goal={g}
                onView={(goal) => {
                  setSelectedGoal(goal);
                  setIsDetailModalOpen(true);
                }}
                onEdit={(goal) => {
                  setSelectedGoal(goal);
                  setIsEditModalOpen(true);
                }}
                onQuickProgress={handleQuickProgress}
                onManualComplete={async (goal) => {
                  const res = await markGoalCompleted(goal.id);
                  handleGoalUpdatedFromDetail(res.data);
                  handleGoalCompletedCelebration(res.data);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Goal Modal */}
      <GoalFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateGoal}
        initialData={selectedGoal}
        isEdit={false}
      />

      {/* Edit Goal Modal */}
      <GoalFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateGoal}
        initialData={selectedGoal}
        isEdit={true}
      />

      {/* Detail Roadmap View Modal */}
      <GoalDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        goal={selectedGoal}
        onGoalUpdated={handleGoalUpdatedFromDetail}
        onEdit={(goal) => {
          setIsDetailModalOpen(false);
          setSelectedGoal(goal);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteGoal}
        onGoalCompletedCelebration={handleGoalCompletedCelebration}
      />

      {/* Celebration Modal */}
      <GoalCelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        goalTitle={celebrationGoal?.title}
        goalType={celebrationGoal?.goalType}
      />

      {/* Achievements Trophy Room Modal */}
      <GoalAchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
      />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
