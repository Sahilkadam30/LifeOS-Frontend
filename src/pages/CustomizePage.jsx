import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  Search,
  Plus,
  Check,
  Trash2,
  RotateCcw,
  SlidersHorizontal,
  X,
  Compass,
  Palette,
  BookOpen,
  Flame,
  TrendingUp,
  Calendar,
  Award,
  Target,
  Music,
  Bookmark,
  Users,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  LayoutGrid
} from "lucide-react";

const DEFAULT_SELECTED_MODULE_IDS = ["connect", "explore", "planner"];

const ALL_MODULES = [
  {
    id: "connect",
    title: "LifeOS Connect",
    category: "Community",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    description: "Connect with people, chat in real-time, share updates, and build meaningful relationships.",
    path: "/connect",
    icon: Users,
    gradient: "from-purple-600 via-indigo-600 to-blue-600",
    glowColor: "rgba(147, 51, 234, 0.15)",
    iconBg: "bg-purple-100 text-purple-700",
    tags: ["Social", "Chat", "People", "Community", "Messages"],
    previewMetrics: "Live Connect • Direct Chat • Active Community Pulse"
  },
  {
    id: "explore",
    title: "LifeOS Explore",
    category: "Community",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Explore community artworks, stories, experiences, and thoughts with interactive likes and comments.",
    path: "/explore",
    icon: Compass,
    gradient: "from-blue-600 via-indigo-600 to-cyan-500",
    glowColor: "rgba(37, 99, 235, 0.15)",
    iconBg: "bg-blue-100 text-blue-700",
    tags: ["Discover", "Art Feed", "Stories", "Trending", "Inspiration"],
    previewMetrics: "Public Gallery • Story Stream • Global Inspiration"
  },
  {
    id: "planner",
    title: "Day Planner",
    category: "Productivity",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    description: "Organize your life. Stay on top of daily tasks, interactive calendar schedules, and deadline alerts.",
    path: "/planner",
    icon: Calendar,
    gradient: "from-indigo-600 via-violet-600 to-purple-600",
    glowColor: "rgba(99, 102, 241, 0.15)",
    iconBg: "bg-indigo-100 text-indigo-700",
    tags: ["Tasks", "Schedule", "Calendar", "Deadlines", "Agenda"],
    previewMetrics: "Today's Agenda • Task Matrix • Smart Deadlines"
  },
  {
    id: "goals",
    title: "Life Goals",
    category: "Growth",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Answer 'What do I want to achieve in my life?' Plan short-term sprints and long-term milestones.",
    path: "/life-goals",
    icon: Target,
    gradient: "from-emerald-500 via-teal-600 to-cyan-600",
    glowColor: "rgba(16, 185, 129, 0.15)",
    iconBg: "bg-emerald-100 text-emerald-700",
    tags: ["Milestones", "Ambition", "Roadmap", "Vision", "Targets"],
    previewMetrics: "Milestones • Strategic Sprints • Vision Board"
  },
  {
    id: "gym",
    title: "Gym & Fitness Hub",
    category: "Wellness",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Build healthy habits, log daily workouts, track meal planners, and hit your fitness peak.",
    path: "/gym/dashboard",
    icon: Flame,
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    glowColor: "rgba(245, 158, 11, 0.15)",
    iconBg: "bg-amber-100 text-amber-700",
    tags: ["Workouts", "Nutrition", "Streaks", "Health", "Fitness"],
    previewMetrics: "Daily Workout • Active Streak • Nutrition Logs"
  },
  {
    id: "finance",
    title: "Wealth & Finance",
    category: "Finance",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    description: "Take control of your budget. Track monthly expenses, save systematically, and monitor investments.",
    path: "/finance/dashboard",
    icon: TrendingUp,
    gradient: "from-teal-500 via-emerald-600 to-green-600",
    glowColor: "rgba(20, 184, 166, 0.15)",
    iconBg: "bg-teal-100 text-teal-700",
    tags: ["Budget", "Expenses", "Savings", "Portfolio", "Money"],
    previewMetrics: "Expense Tracker • Net Worth • Savings Goals"
  },
  {
    id: "skills",
    title: "Skills & Learning",
    category: "Growth",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    description: "Enhance your knowledge. Track study sessions, manage academic subjects, progress and milestones.",
    path: "/skills/dashboard",
    icon: Award,
    gradient: "from-cyan-500 via-sky-600 to-blue-600",
    glowColor: "rgba(6, 182, 212, 0.15)",
    iconBg: "bg-cyan-100 text-cyan-700",
    tags: ["Study", "Certifications", "Knowledge", "Progress", "Habits"],
    previewMetrics: "Study Clock • Subject Logs • Mastery Badges"
  },
  {
    id: "travel",
    title: "Travel & Journeys",
    category: "Lifestyle",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    description: "Explore the world. Pin visited spots, manage trip logistics, and update your personal travel feed.",
    path: "/travel",
    icon: Compass,
    gradient: "from-sky-500 via-blue-600 to-indigo-600",
    glowColor: "rgba(14, 165, 233, 0.15)",
    iconBg: "bg-sky-100 text-sky-700",
    tags: ["Trips", "Map", "Adventures", "Pins", "Vacations"],
    previewMetrics: "Interactive Map • Trip Itinerary • Visited Spots"
  },
  {
    id: "art",
    title: "Creative Art Zone",
    category: "Creativity",
    badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
    description: "Unleash your artistic side. Organize your hobbies, upload drawings, and curate your collection.",
    path: "/art-zone",
    icon: Palette,
    gradient: "from-pink-500 via-rose-500 to-fuchsia-600",
    glowColor: "rgba(236, 72, 153, 0.15)",
    iconBg: "bg-pink-100 text-pink-700",
    tags: ["Drawings", "Artworks", "Showcase", "Gallery", "Creativity"],
    previewMetrics: "Artwork Vault • Creative Canvas • Portfolio"
  },
  {
    id: "writings",
    title: "Writings & Notes",
    category: "Creativity",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    description: "Your digital sanctuary for thoughts. Pen stories, compose poems, and keep categorized notes.",
    path: "/WritingsPage",
    icon: BookOpen,
    gradient: "from-purple-500 via-violet-600 to-indigo-600",
    glowColor: "rgba(168, 85, 247, 0.15)",
    iconBg: "bg-purple-100 text-purple-700",
    tags: ["Stories", "Poems", "Notes", "Ideas", "Journaling"],
    previewMetrics: "Thought Sanctuary • Categorized Notes • Drafts"
  },
  {
    id: "music",
    title: "Music Studio",
    category: "Creativity",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    description: "Create. Record. Practice. Remember. Store singing, instrument recordings, and audio ideas.",
    path: "/music",
    icon: Music,
    gradient: "from-rose-500 via-red-500 to-orange-500",
    glowColor: "rgba(244, 63, 94, 0.15)",
    iconBg: "bg-rose-100 text-rose-700",
    tags: ["Audio", "Tracks", "Practice", "Recordings", "Instruments"],
    previewMetrics: "Audio Studio • Practice Sessions • Track Vault"
  },
  {
    id: "journal",
    title: "Life Journal",
    category: "Lifestyle",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    description: "Chronicle your taste and cultural journey. Catalog movies, books, food discoveries, and favorites.",
    path: "/journal",
    icon: Bookmark,
    gradient: "from-violet-500 via-purple-600 to-indigo-600",
    glowColor: "rgba(139, 92, 246, 0.15)",
    iconBg: "bg-violet-100 text-violet-700",
    tags: ["Books", "Movies", "Food", "Memories", "Reflections"],
    previewMetrics: "Cultural Log • Reviews & Ratings • Favorites"
  }
];

const CATEGORIES = ["All", "Community", "Productivity", "Growth", "Wellness", "Finance", "Creativity", "Lifestyle"];

const getUserModulesStorageKey = (user) => {
  const uid =
    user?.id ||
    user?.username ||
    user?.email ||
    sessionStorage.getItem("userId") ||
    localStorage.getItem("userId");
  return uid ? `lifeos_front_modules_user_${uid}` : "lifeos_front_modules_guest";
};

const readSelectedIds = (storageKey) => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return DEFAULT_SELECTED_MODULE_IDS;
};

const saveSelectedIds = (storageKey, ids) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(ids));
  } catch (_) {}
};

export default function CustomizePage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  /* User-specific storage key so customizations are completely separate per user */
  const userStorageKey = useMemo(() => getUserModulesStorageKey(user), [user]);

  const [selectedIds, setSelectedIds] = useState(() => readSelectedIds(userStorageKey));
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [toast, setToast] = useState(null);

  /* Sync selectedIds when user / userStorageKey changes */
  useEffect(() => {
    setSelectedIds(readSelectedIds(userStorageKey));
  }, [userStorageKey]);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = (id) => {
    if (selectedIds.includes(id)) return;
    const updated = [...selectedIds, id];
    setSelectedIds(updated);
    saveSelectedIds(userStorageKey, updated);
    const m = ALL_MODULES.find((m) => m.id === id);
    showToast(`"${m?.title}" added to your dashboard!`, "success");
  };

  const handleRemove = (id) => {
    const updated = selectedIds.filter((s) => s !== id);
    setSelectedIds(updated);
    saveSelectedIds(userStorageKey, updated);
    const m = ALL_MODULES.find((m) => m.id === id);
    showToast(`"${m?.title}" removed from dashboard.`, "info");
  };

  const handleReset = () => {
    setSelectedIds(DEFAULT_SELECTED_MODULE_IDS);
    saveSelectedIds(userStorageKey, DEFAULT_SELECTED_MODULE_IDS);
    showToast("Dashboard restored to defaults (Connect, Explore, Day Planner)", "info");
  };

  const filteredModules = useMemo(() => {
    return ALL_MODULES.filter((m) => {
      const matchCat = activeCategory === "All" || m.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  const activeModules = useMemo(
    () => selectedIds.map((id) => ALL_MODULES.find((m) => m.id === id)).filter(Boolean),
    [selectedIds]
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.95 }}
            className={`fixed top-5 right-5 z-[200] max-w-sm px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-slate-900/95 border-emerald-500/30 text-white"
                : "bg-slate-900/95 border-sky-500/30 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-sky-400 shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-auto text-white/50 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Back to Dashboard */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all text-sm font-semibold cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Title */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">Dashboard Customizer</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">LifeOS Module Marketplace</p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <Layers className="h-3.5 w-3.5 text-indigo-500" />
              {selectedIds.length} active
            </span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset to Defaults</span>
            </button>
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all cursor-pointer"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Save & Go to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">

        {/* ── HERO BANNER ── */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-8 sm:px-12 py-10 shadow-xl border border-slate-800">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-indigo-300 text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Module Marketplace
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
                Customize Your Dashboard
              </h2>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Browse all {ALL_MODULES.length} LifeOS workspaces. Click <strong className="text-white">Add to Dashboard</strong> to feature any module in your front row. Changes are saved automatically.
              </p>
            </div>
            <div className="flex gap-4 shrink-0">
              <div className="text-center px-5 py-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                <div className="text-2xl font-black text-white">{ALL_MODULES.length}</div>
                <div className="text-[11px] uppercase font-bold text-indigo-300 mt-0.5">Workspaces</div>
              </div>
              <div className="text-center px-5 py-3 rounded-2xl bg-indigo-600/40 border border-indigo-500/30 backdrop-blur-md">
                <div className="text-2xl font-black text-white">{selectedIds.length}</div>
                <div className="text-[11px] uppercase font-bold text-indigo-300 mt-0.5">In Dashboard</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── YOUR CURRENT DASHBOARD MODULES ── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Your Dashboard Modules</h2>
                <p className="text-xs text-slate-500">These appear on your front row. Click remove to unpin.</p>
              </div>
            </div>
            {activeModules.length > 0 && (
              <button
                onClick={handleReset}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-all cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset defaults
              </button>
            )}
          </div>

          {activeModules.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center">
              <Layers className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-500">No modules in your dashboard yet.</p>
              <p className="text-xs text-slate-400 mt-1">Add modules from the catalog below.</p>
            </div>
          ) : (
            <motion.div layout className="flex flex-wrap gap-3">
              <AnimatePresence>
                {activeModules.map((m) => {
                  const Icon = m.icon;
                  return (
                    <motion.div
                      layout
                      key={m.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.75 }}
                      className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className={`p-1.5 rounded-lg ${m.iconBg}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-800">{m.title}</span>
                      <button
                        onClick={() => handleRemove(m.id)}
                        className="ml-1 p-1 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Remove from dashboard"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        {/* ── DIVIDER ── */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">All Workspaces</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* ── SEARCH + CATEGORY FILTERS ── */}
        <section className="flex flex-col gap-4 -mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules — e.g. gym, finance, music, travel..."
                className="w-full pl-11 pr-10 py-3.5 bg-white rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all outline-none shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ── MODULE CATALOG GRID ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 -mt-2 pb-12">
          <AnimatePresence>
            {filteredModules.length === 0 ? (
              <div className="col-span-full py-16 text-center">
                <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-500">No results for "{searchQuery}"</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredModules.map((m) => {
                const Icon = m.icon;
                const isSelected = selectedIds.includes(m.id);
                return (
                  <motion.div
                    layout
                    key={m.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className={`relative flex flex-col bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-250 ${
                      isSelected
                        ? "border-indigo-300 ring-2 ring-indigo-500/15"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    style={{ boxShadow: isSelected ? `0 8px 30px -8px ${m.glowColor}` : undefined }}
                  >
                    {/* Top gradient bar */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${m.gradient}`} />

                    <div className="p-6 flex flex-col gap-4 flex-1">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-2xl ${m.iconBg} shadow-sm`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${m.badgeColor}`}>
                              {m.category}
                            </span>
                            <h3 className="text-base font-black text-slate-900 mt-1 leading-tight">{m.title}</h3>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">
                            <Check className="h-3 w-3" />
                            Added
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-600 leading-relaxed flex-1">{m.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {m.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer: preview metrics + action button */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <p className="text-[11px] text-slate-400 font-medium truncate max-w-[160px]">
                          {m.previewMetrics}
                        </p>
                        {isSelected ? (
                          <button
                            onClick={() => handleRemove(m.id)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAdd(m.id)}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-indigo-300/40 transition-all active:scale-95 cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add to Dashboard
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </section>

      </main>

      {/* Sticky bottom save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-4 shadow-2xl shadow-slate-900/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-100">
            <LayoutGrid className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">{selectedIds.length} module{selectedIds.length !== 1 ? "s" : ""} active</p>
            <p className="text-xs text-slate-500">Changes auto-saved to your dashboard</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
