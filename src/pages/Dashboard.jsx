import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../components/store/slice/auth.slice";
import { motion } from "framer-motion";
import {
  Compass,
  Palette,
  BookOpen,
  Flame,
  TrendingUp,
  Calendar,
  Award,
  LogOut,
  Sparkles,
  ArrowRight,
  User
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch(logout());
    navigate("/login");
  };

  const modules = [
    {
      title: "Gym & Fitness Hub",
      description: "Build healthy habits, log daily workouts, track meal planners, and hit your fitness goals.",
      path: "/gym/dashboard",
      icon: Flame,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600",
      iconBg: "bg-amber-50",
      glowColor: "rgba(245, 158, 11, 0.15)"
    },
    {
      title: "Wealth & Finance",
      description: "Take control of your budget. Track monthly expenses, save systematically, and monitor investments.",
      path: "/finance/dashboard",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      glowColor: "rgba(16, 185, 129, 0.15)"
    },
    {
      title: "Skills & Learning",
      description: "Enhance your knowledge. Track study sessions, manage academic subjects, progress and milestones.",
      path: "/skills/dashboard",
      icon: Award,
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-600",
      iconBg: "bg-cyan-50",
      glowColor: "rgba(6, 182, 212, 0.15)"
    },
    {
      title: "Day Planner",
      description: "Organize your life. Stay on top of daily tasks, calendar schedules, and deadline alerts.",
      path: "/planner",
      icon: Calendar,
      color: "from-indigo-500 to-violet-600",
      textColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
      glowColor: "rgba(99, 102, 241, 0.15)"
    },
    {
      title: "Travel & Journeys",
      description: "Explore the world. Pin visited spots, manage trip logistics, and update your personal travel feed.",
      path: "/travel",
      icon: Compass,
      color: "from-sky-500 to-blue-500",
      textColor: "text-sky-600",
      iconBg: "bg-sky-50",
      glowColor: "rgba(14, 165, 233, 0.15)"
    },
    {
      title: "Creative Art Zone",
      description: "Unleash your artistic side. Organize your hobbies, upload drawings, and curate your collection.",
      path: "/art-zone",
      icon: Palette,
      color: "from-pink-500 to-rose-600",
      textColor: "text-pink-600",
      iconBg: "bg-pink-50",
      glowColor: "rgba(236, 72, 153, 0.15)"
    },
    {
      title: "Writings & Notes",
      description: "Your digital sanctuary for thoughts. Pen stories, compose poems, and keep categorized notes.",
      path: "/WritingsPage",
      icon: BookOpen,
      color: "from-purple-500 to-indigo-600",
      textColor: "text-purple-600",
      iconBg: "bg-purple-50",
      glowColor: "rgba(168, 85, 247, 0.15)"
    }
  ];

  // Framer Motion animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans flex flex-col antialiased">
      {/* Sleek Modern Header */}
      <nav className="bg-white border-b border-[#E2E8F0] px-6 py-4 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/home")}>
            <div className="p-2 bg-gradient-to-tr from-[#7C3AED] to-[#3B82F6] rounded-xl text-white shadow-md shadow-indigo-100">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent">
              LifeOS
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
                <User className="h-4 w-4 text-[#64748B]" />
                <span className="text-sm font-semibold text-[#475569]">
                  Hi, {user.username || "User"}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 rounded-xl text-sm font-semibold bg-rose-50/50 hover:bg-rose-100 hover:text-rose-700 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full flex flex-col justify-center">
        {/* Welcome Headline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping"></span>
            LifeOS Navigation Center
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight mb-3">
            Your Personal Space
          </h1>
          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            Welcome to your simple LifeOS command dashboard. Click on any workspace below to manage and track your life.
          </p>
        </motion.div>

        {/* Modules Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.path}
                variants={itemVariants}
                onClick={() => navigate(m.path)}
                whileHover={{ y: -5, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                className="group relative bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-slate-300 cursor-pointer transition-all duration-300 flex flex-col justify-between h-56"
                style={{
                  "--hover-glow": m.glowColor
                }}
              >
                <div>
                  {/* Top section: Icon and dynamic indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${m.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${m.textColor}`} />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#94A3B8] group-hover:text-indigo-600 transition-colors">
                      <span>Open Space</span>
                      <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Module Title */}
                  <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-indigo-600 transition-colors mb-2">
                    {m.title}
                  </h3>

                  {/* Module Description */}
                  <p className="text-sm text-[#64748B] leading-relaxed line-clamp-3">
                    {m.description}
                  </p>
                </div>

                {/* Subtly animated gradient line decoration at bottom */}
                <div className={`absolute bottom-0 left-0 right-0 h-1.5 rounded-b-2xl bg-gradient-to-r ${m.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Styled Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-6 text-center text-xs text-[#94A3B8] mt-12">
        <p>LifeOS • Designed to simplify, organize, and track your life.</p>
      </footer>
    </div>
  );
}