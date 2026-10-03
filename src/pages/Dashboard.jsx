import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../components/store/slice/auth.slice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Quote,
  RefreshCw,
  LogOut,
  Compass,
  Palette,
  BookOpen,
  Flame,
  TrendingUp,
  Calendar,
  Award,
  ArrowRight,
  Layers,
  SlidersHorizontal,
  Target,
  Music,
  Bookmark,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  RotateCcw,
  LayoutGrid
} from "lucide-react";

/* ─────────────────────────────────────────────
   SHARED MODULE REGISTRY  (synced with CustomizePage)
───────────────────────────────────────────── */
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
    glowColor: "rgba(147,51,234,0.15)",
    accentColor: "border-purple-200 hover:border-purple-400",
    iconBg: "bg-purple-100 text-purple-700",
    previewMetrics: "Live Connect • Direct Chat • Community Pulse"
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
    glowColor: "rgba(37,99,235,0.15)",
    accentColor: "border-blue-200 hover:border-blue-400",
    iconBg: "bg-blue-100 text-blue-700",
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
    glowColor: "rgba(99,102,241,0.15)",
    accentColor: "border-indigo-200 hover:border-indigo-400",
    iconBg: "bg-indigo-100 text-indigo-700",
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
    glowColor: "rgba(16,185,129,0.15)",
    accentColor: "border-emerald-200 hover:border-emerald-400",
    iconBg: "bg-emerald-100 text-emerald-700",
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
    glowColor: "rgba(245,158,11,0.15)",
    accentColor: "border-amber-200 hover:border-amber-400",
    iconBg: "bg-amber-100 text-amber-700",
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
    glowColor: "rgba(20,184,166,0.15)",
    accentColor: "border-teal-200 hover:border-teal-400",
    iconBg: "bg-teal-100 text-teal-700",
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
    glowColor: "rgba(6,182,212,0.15)",
    accentColor: "border-cyan-200 hover:border-cyan-400",
    iconBg: "bg-cyan-100 text-cyan-700",
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
    glowColor: "rgba(14,165,233,0.15)",
    accentColor: "border-sky-200 hover:border-sky-400",
    iconBg: "bg-sky-100 text-sky-700",
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
    glowColor: "rgba(236,72,153,0.15)",
    accentColor: "border-pink-200 hover:border-pink-400",
    iconBg: "bg-pink-100 text-pink-700",
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
    glowColor: "rgba(168,85,247,0.15)",
    accentColor: "border-purple-200 hover:border-purple-400",
    iconBg: "bg-purple-100 text-purple-700",
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
    glowColor: "rgba(244,63,94,0.15)",
    accentColor: "border-rose-200 hover:border-rose-400",
    iconBg: "bg-rose-100 text-rose-700",
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
    glowColor: "rgba(139,92,246,0.15)",
    accentColor: "border-violet-200 hover:border-violet-400",
    iconBg: "bg-violet-100 text-violet-700",
    previewMetrics: "Cultural Log • Reviews & Ratings • Favorites"
  }
];

const FALLBACK_QUOTES = [
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { quote: "Act as if what you do makes a difference. It does.", author: "William James" }
];

const getUserModulesStorageKey = (user) => {
  const uid =
    user?.id ||
    user?.username ||
    user?.email ||
    sessionStorage.getItem("userId") ||
    localStorage.getItem("userId");
  return uid ? `lifeos_front_modules_user_${uid}` : "lifeos_front_modules_guest";
};

const readIds = (storageKey) => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const p = JSON.parse(saved);
      if (Array.isArray(p) && p.length > 0) return p;
    }
  } catch (_) {}
  return DEFAULT_SELECTED_MODULE_IDS;
};

const saveIds = (storageKey, ids) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(ids));
  } catch (_) {}
};

/* ─────────────────────────────────────────────
   DASHBOARD COMPONENT
───────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  /* User-specific storage key so customizations are completely separate per user */
  const userStorageKey = useMemo(() => getUserModulesStorageKey(user), [user]);

  /* Quote */
  const [quoteData, setQuoteData] = useState({
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  });
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);

  /* Selected modules — read from user-specific localStorage on mount & when user changes */
  const [selectedIds, setSelectedIds] = useState(() => readIds(userStorageKey));

  /* Toast */
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  /* Sync selectedIds when user / userStorageKey changes */
  useEffect(() => {
    setSelectedIds(readIds(userStorageKey));
  }, [userStorageKey]);

  /* Re-read localStorage when the tab regains focus (user came back from
     the customize page without a full navigation event) */
  useEffect(() => {
    const onFocus = () => setSelectedIds(readIds(userStorageKey));
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [userStorageKey]);

  /* Fetch quote */
  const fetchRandomQuote = async () => {
    setIsFetchingQuote(true);
    try {
      const res = await fetch("https://dummyjson.com/quotes/random");
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data?.quote) setQuoteData({ quote: data.quote, author: data.author || "Anonymous" });
    } catch {
      setQuoteData(FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]);
    } finally {
      setIsFetchingQuote(false);
    }
  };

  useEffect(() => { fetchRandomQuote(); }, []);

  /* Quick-remove directly from dashboard (persists to this user's key) */
  const handleRemove = (id, e) => {
    e.stopPropagation();
    const updated = selectedIds.filter((s) => s !== id);
    setSelectedIds(updated);
    saveIds(userStorageKey, updated);
    const m = ALL_MODULES.find((m) => m.id === id);
    showToast(`"${m?.title}" removed. Visit Customize to add it back.`, "info");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch(logout());
    navigate("/login");
  };

  /* Derive front-row modules */
  const frontRowModules = useMemo(
    () => selectedIds.map((id) => ALL_MODULES.find((m) => m.id === id)).filter(Boolean),
    [selectedIds]
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 right-5 z-[100] max-w-sm px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-slate-900/95 text-white border-emerald-500/30"
                : "bg-slate-900/95 text-white border-sky-500/30"
            }`}
          >
            {toast.type === "success"
              ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              : <AlertCircle className="h-5 w-5 text-sky-400 shrink-0" />}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-auto text-white/40 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          HEADER
          Left  : LifeOS branding
          Middle: Random inspirational quote
          Right : User name + logout
      ══════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/88 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-6 py-5 min-h-[92px]">

            {/* LEFT — LifeOS brand */}
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-4 cursor-pointer shrink-0 group select-none"
            >
              <div className="p-3.5 bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-500 rounded-2xl text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-all duration-300">
                <Sparkles className="h-7 w-7 animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
                  LifeOS
                </span>
                <span className="text-xs uppercase tracking-widest font-bold text-slate-400 -mt-0.5">
                  Living System
                </span>
              </div>
            </button>

            {/* MIDDLE — inspirational quote from dummyjson.com/quotes/random */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-6 items-center justify-center">
              <div className="relative w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-2xl px-5 py-3.5 flex items-center gap-4 transition-all hover:border-indigo-200">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                  <Quote className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={quoteData.quote}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col sm:flex-row sm:items-center sm:gap-2"
                    >
                      <p className="text-[13px] sm:text-sm font-medium text-slate-700 italic truncate" title={quoteData.quote}>
                        "{quoteData.quote}"
                      </p>
                      <span className="text-xs font-bold text-indigo-600 shrink-0">— {quoteData.author}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <button
                  onClick={fetchRandomQuote}
                  disabled={isFetchingQuote}
                  title="Get a new quote"
                  className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`h-4.5 w-4.5 ${isFetchingQuote ? "animate-spin text-indigo-600" : ""}`} />
                </button>
              </div>
            </div>

            {/* RIGHT — user + logout */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-100/80 rounded-2xl border border-slate-200">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="text-sm font-bold text-slate-800">
                  {user?.username || "User"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 border border-rose-200 text-rose-600 rounded-2xl text-sm font-semibold bg-rose-50/60 hover:bg-rose-100 transition-all cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </div>

          {/* Mobile quote bar */}
          <div className="md:hidden py-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Quote className="h-4 w-4 text-indigo-600 shrink-0" />
              <p className="italic text-slate-600 truncate text-xs">
                "{quoteData.quote}" <span className="font-semibold text-indigo-600">— {quoteData.author}</span>
              </p>
            </div>
            <button onClick={fetchRandomQuote} disabled={isFetchingQuote} className="p-1 text-slate-400 hover:text-indigo-600">
              <RefreshCw className={`h-3 w-3 ${isFetchingQuote ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          MAIN
      ══════════════════════════════════════════ */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">

        {/* Welcome hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-8 sm:px-12 py-10 shadow-xl border border-slate-800">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
                Welcome back, {user?.username || "Explorer"}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Your hand-picked workspaces, front and center. Launch any module instantly or customize your layout.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* ← KEY BUTTON: navigate to /customize */}
              <button
                onClick={() => navigate("/customize")}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-lg shadow-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                <span>Customize Modules</span>
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FRONT ROW — only selected modules shown
        ══════════════════════════════════════════ */}
        <section className="flex flex-col gap-5">
          {/* Row header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    My Dashboard
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {frontRowModules.length} {frontRowModules.length === 1 ? "Module" : "Modules"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Only your added modules appear here.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/customize")}
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <span>+ Add / Remove Modules</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Empty state */}
          {frontRowModules.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-14 text-center flex flex-col items-center justify-center"
            >
              <div className="p-5 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
                <Layers className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-1">Your dashboard is empty</h3>
              <p className="text-sm text-slate-500 max-w-md mb-7">
                You haven't added any modules yet. Head to the Customizer to pick your favourite workspaces.
              </p>
              <button
                onClick={() => navigate("/customize")}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-md shadow-indigo-200 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Open Module Customizer
              </button>
            </motion.div>
          ) : (
            /* Module cards grid */
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {frontRowModules.map((m) => {
                  const Icon = m.icon;
                  return (
                    <motion.div
                      layout
                      key={m.id}
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: -10 }}
                      transition={{ duration: 0.22 }}
                      onClick={() => navigate(m.path)}
                      className={`group relative bg-white rounded-3xl border ${m.accentColor} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer min-h-[252px]`}
                      style={{ boxShadow: `0 10px 30px -10px ${m.glowColor}` }}
                    >
                      {/* Top gradient strip */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${m.gradient}`} />

                      <div className="p-6 pt-7 flex flex-col gap-3 flex-1">
                        {/* Icon row */}
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-2xl ${m.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          {/* Quick-remove button (visible on hover) */}
                          <button
                            onClick={(e) => handleRemove(m.id, e)}
                            title="Remove from dashboard"
                            className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Badge */}
                        <span className={`self-start text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${m.badgeColor}`}>
                          {m.category}
                        </span>

                        {/* Title + description */}
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                          {m.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
                          {m.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="px-6 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-medium truncate max-w-[180px]">
                          {m.previewMetrics}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                          <span>Open</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 mt-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-extrabold text-slate-700">LifeOS</span>
            <span>•</span>
            <span>Your Personal Operating System</span>
          </div>
          <p>Quotes powered by DummyJSON • Fully customizable dashboard</p>
        </div>
      </footer>
    </div>
  );
}