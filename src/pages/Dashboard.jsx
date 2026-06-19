import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../components/store/slice/auth.slice";
import API from "../api";
import "../styles/Dashboard.css";
import {
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronRight,
  Heart,
  BarChart2,
  ArrowRight,
  Home,
  Target,
  Users,
  Settings,
  Gift,
  BookOpen,
  Camera,
  Music,
  Palette,
  Smile,
  Compass,
  Check,
  Award
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  // Real or local state for interactive demo/integration
  const [habits, setHabits] = useState([
    { id: 1, name: "Drink Water", completed: true },
    { id: 2, name: "Morning Workout", completed: true },
    { id: 3, name: "Read 20 Pages", completed: true },
    { id: 4, name: "Meditate 10 Min", completed: false },
    { id: 5, name: "No Sugar", completed: false },
    { id: 6, name: "Sleep by 11 PM", completed: false }
  ]);

  const [activeTab, setActiveTab] = useState("Home");

  // Handle habit toggling dynamically
  const toggleHabitState = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const habitsPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  // Sign out helper
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="lo-page">
      {/* ─── NAVBAR ─── */}
      <nav className="lo-navbar">
        <div className="lo-navbar-brand" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <Sparkles className="lo-logo-icon" />
          <span>LifeOS</span>
        </div>
        <div className="lo-navbar-links">
          <a href="#" className={activeTab === "Home" ? "active" : ""} onClick={(e) => { e.preventDefault(); setActiveTab("Home"); }}>Home</a>
          <a href="#" className={activeTab === "Habits" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("/gym/dashboard"); }}>Habits</a>
          <a href="#" className={activeTab === "Hobbies" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("/art-zone"); }}>Hobbies</a>
          <a href="#" className={activeTab === "Stats" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("/finance/dashboard"); }}>Stats</a>
          <a href="#" className={activeTab === "Planner" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("/planner"); }}>Planner</a>
        </div>
        <div className="lo-navbar-actions">
          {user ? (
            <>
              <span className="lo-user-welcome" style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--lo-text)", marginRight: "8px" }}>
                Hi, {user.username || "User"}
              </span>
              <button className="lo-btn-outline" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <button className="lo-btn-outline" onClick={() => navigate("/login")}>Log in</button>
              <button className="lo-btn-primary" onClick={() => navigate("/register")}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="lo-hero">
        <div className="lo-hero-left lo-animate-up">
          <div className="lo-hero-badge">
            <Sparkles size={14} />
            <span>Free Forever</span>
          </div>
          <h1>
            Track Habits.<br />
            Explore Hobbies.<br />
            <span>Build a Better You.</span>
          </h1>
          <p className="lo-hero-subtitle">
            LifeOS is your free space to build good habits, explore hobbies you love, and track progress that truly matters.
          </p>
          <div className="lo-hero-buttons">
            <button className="lo-hero-btn primary" onClick={() => navigate("/register")}>
              Get Started Free <ArrowRight size={16} />
            </button>
            <button className="lo-hero-btn secondary" onClick={() => navigate("/art-zone")}>
              <Heart size={16} style={{ fill: "currentColor" }} /> Explore Hobbies
            </button>
          </div>
          <div className="lo-hero-social">
            <div className="lo-hero-avatars">
              <span style={{ backgroundColor: "#8b5cf6" }}>JD</span>
              <span style={{ backgroundColor: "#ec4899" }}>AM</span>
              <span style={{ backgroundColor: "#3b82f6" }}>KT</span>
              <span style={{ backgroundColor: "#10b981" }}>SR</span>
            </div>
            <div className="lo-hero-social-info">
              <div className="lo-hero-stars">★★★★★</div>
              <p className="lo-hero-social-text">
                <strong>10,000+ users</strong> loving their journey
              </p>
            </div>
          </div>
        </div>

        {/* HERO RIGHT: PREMIUM APP INTERACTIVE MOCKUP PANEL */}
        <div className="lo-hero-right lo-animate-right">
          <div className="lo-preview">
            {/* Embedded Floating Sidebar */}
            <div className="lo-preview-sidebar">
              <div className="lo-preview-sidebar-icon active"><Sparkles size={16} /></div>
              <div className="lo-preview-sidebar-icon" onClick={() => navigate("/home")} title="Home"><Home size={16} /></div>
              <div className="lo-preview-sidebar-icon" onClick={() => navigate("/gym/dashboard")} title="Gym & Habits"><Target size={16} /></div>
              <div className="lo-preview-sidebar-icon" onClick={() => navigate("/art-zone")} title="Art & Hobbies"><Heart size={16} /></div>
              <div className="lo-preview-sidebar-icon" onClick={() => navigate("/finance/dashboard")} title="Finance Stats"><BarChart2 size={16} /></div>
              <div className="lo-preview-sidebar-icon" onClick={() => navigate("/travel")} title="Travel Sections"><Compass size={16} /></div>
              <div className="lo-preview-sidebar-icon" onClick={() => navigate("/planner")} title="Planner & Tasks"><Settings size={16} /></div>
            </div>

            {/* Dashboard Mockup Content */}
            <div className="lo-preview-header">
              <div className="lo-preview-welcome">
                Welcome back, {user?.username || "Alex"}! 👋
                <small>Let's make today a productive one.</small>
              </div>
              <div className="lo-streak-badge">
                <Flame size={16} style={{ fill: "currentColor" }} />
                <span>12 Day Streak</span>
              </div>
            </div>

            <div className="lo-preview-grid">
              {/* Habits Preview */}
              <div className="lo-mini-card">
                <h4>Today's Habits</h4>
                <div className="stat-big" style={{ marginBottom: "8px" }}>
                  {habits.slice(0, 5).filter(h => h.completed).length} <small>/ 5 Completed</small>
                </div>
                <div className="lo-habits-progress-bar" style={{ height: "6px", marginBottom: "12px" }}>
                  <div 
                    className="lo-habits-progress-fill" 
                    style={{ width: `${Math.min(100, Math.round((habits.slice(0, 5).filter(h => h.completed).length / 5) * 100))}%` }}
                  ></div>
                </div>
                <div className="lo-habit-list">
                  {habits.slice(0, 5).map((habit) => (
                    <div 
                      key={habit.id} 
                      className="lo-habit-item" 
                      onClick={() => toggleHabitState(habit.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className={`lo-habit-check ${habit.completed ? "done" : "pending"}`}>
                        {habit.completed && <Check size={10} strokeWidth={3} />}
                      </div>
                      <span style={{ textDecoration: habit.completed ? "line-through" : "none", color: habit.completed ? "var(--lo-text-secondary)" : "var(--lo-text)" }}>
                        {habit.name}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="lo-mini-link" onClick={() => navigate("/gym/dashboard")}>View all</div>
              </div>

              {/* Hobbies Preview */}
              <div className="lo-mini-card">
                <h4>Explore a Hobby</h4>
                <div className="lo-hobby-tags" style={{ marginTop: "8px" }}>
                  <div className="lo-hobby-tag" style={{ background: "#eef2ff", color: "#4f46e5" }}>🎸 Guitar</div>
                  <div className="lo-hobby-tag" style={{ background: "#fdf2f8", color: "#db2777" }}>🎨 Painting</div>
                  <div className="lo-hobby-tag" style={{ background: "#ecfdf5", color: "#059669" }}>📷 Photography</div>
                  <div className="lo-hobby-tag" style={{ background: "#fef3c7", color: "#d97706" }}>✍️ Writing</div>
                  <div className="lo-hobby-tag" style={{ background: "#eff6ff", color: "#2563eb" }}>🌱 Gardening</div>
                  <div className="lo-hobby-tag" style={{ background: "#fff1f2", color: "#e11d48" }}>🍳 Cooking</div>
                </div>
                <div className="lo-mini-link" style={{ marginTop: "24px" }} onClick={() => navigate("/art-zone")}>
                  View all hobbies
                </div>
              </div>

              {/* Weekly Progress Line Chart Preview */}
              <div className="lo-mini-card lo-progress-card">
                <h4>Weekly Progress</h4>
                <div className="lo-progress-bars">
                  {[
                    { label: "Mon", val: 40 },
                    { label: "Tue", val: 55 },
                    { label: "Wed", val: 70 },
                    { label: "Thu", val: 85, active: true },
                    { label: "Fri", val: 60 },
                    { label: "Sat", val: 45 },
                    { label: "Sun", val: 90 }
                  ].map((d, i) => (
                    <div className="lo-bar-wrapper" key={i}>
                      <div 
                        className={`lo-bar ${d.active ? "active" : ""}`} 
                        style={{ height: `${d.val}%` }}
                      >
                        {d.active && <span className="lo-bar-pct">85%</span>}
                      </div>
                      <span className="lo-bar-label">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Notice */}
              <div className="lo-week-msg">
                <div className="lo-week-emoji">
                  <Smile size={24} color="#fff" />
                </div>
                <div className="lo-week-msg-text">
                  <h4>This Week</h4>
                  <p><strong>Great job!</strong> You're doing awesome.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID SECTION ─── */}
      <section className="lo-features">
        <h2>Everything You Need, All in One Place</h2>
        <div className="lo-features-grid">
          <div className="lo-feature-card lo-animate-up" onClick={() => navigate("/gym/dashboard")}>
            <div className="lo-feature-icon purple">
              <CheckCircle2 size={24} />
            </div>
            <h3>Track Habits</h3>
            <p>Build and track daily habits. Stay consistent and see real progress.</p>
          </div>

          <div className="lo-feature-card lo-animate-up lo-animate-delay-1" onClick={() => navigate("/art-zone")}>
            <div className="lo-feature-icon red">
              <Heart size={24} style={{ fill: "currentColor" }} />
            </div>
            <h3>Explore Hobbies</h3>
            <p>Choose from a variety of hobbies and track the time spent doing what you love.</p>
          </div>

          <div className="lo-feature-card lo-animate-up lo-animate-delay-2" onClick={() => navigate("/finance/dashboard")}>
            <div className="lo-feature-icon blue">
              <BarChart2 size={24} />
            </div>
            <h3>Beautiful Stats</h3>
            <p>Visualize your progress with simple and powerful statistics.</p>
          </div>

          <div className="lo-feature-card lo-animate-up lo-animate-delay-3" onClick={() => navigate("/gym/goals")}>
            <div className="lo-feature-icon orange">
              <Flame size={24} style={{ fill: "currentColor" }} />
            </div>
            <h3>Streaks & Goals</h3>
            <p>Stay motivated with streaks, goals, and daily reminders.</p>
          </div>

          <div className="lo-feature-card lo-animate-up lo-animate-delay-4">
            <div className="lo-feature-icon green">
              <Gift size={24} />
            </div>
            <h3>100% Free</h3>
            <p>All features. Always free. No hidden costs, ever.</p>
          </div>
        </div>
      </section>

      {/* ─── MODULE DETAILED SECTION ─── */}
      <section className="lo-modules">
        {/* HOBBIES ROW */}
        <div className="lo-module-row">
          <div className="lo-module-intro">
            <div className="label">Hobbies</div>
            <h3>Do More of What You Love</h3>
            <p>Pick your favorite hobbies and track how much time you spend on them each day.</p>
            <button className="lo-module-btn" onClick={() => navigate("/art-zone")}>Browse Hobbies</button>
          </div>

          <div className="lo-module-content">
            <div className="lo-module-content-header">
              <h4>My Hobbies</h4>
              <a onClick={() => navigate("/art-zone")}>View all</a>
            </div>
            <div className="lo-module-items">
              <div className="lo-module-item" onClick={() => navigate("/art-zone")}>
                <div className="lo-module-item-icon">🎸</div>
                <div className="lo-module-item-name">Guitar</div>
                <div className="lo-module-item-meta">4.5 hrs this week</div>
              </div>
              <div className="lo-module-item" onClick={() => navigate("/art-zone")}>
                <div className="lo-module-item-icon">📷</div>
                <div className="lo-module-item-name">Photography</div>
                <div className="lo-module-item-meta">3 hrs this week</div>
              </div>
              <div className="lo-module-item" onClick={() => navigate("/art-zone")}>
                <div className="lo-module-item-icon">📚</div>
                <div className="lo-module-item-name">Reading</div>
                <div className="lo-module-item-meta">5 hrs this week</div>
              </div>
              <div className="lo-module-item" onClick={() => navigate("/art-zone")}>
                <div className="lo-module-item-icon">🎨</div>
                <div className="lo-module-item-name">Painting</div>
                <div className="lo-module-item-meta">2.5 hrs this week</div>
              </div>
            </div>
          </div>

          <div className="lo-module-stats">
            <h4>Time Spent This Week</h4>
            <div className="big-stat">15h 30m</div>
            <div className="stat-change">↑ 12% from last week</div>
            <div className="lo-mini-bars">
              <div className="lo-mini-bar purple" style={{ height: "40%" }}></div>
              <div className="lo-mini-bar purple" style={{ height: "30%" }}></div>
              <div className="lo-mini-bar purple" style={{ height: "60%" }}></div>
              <div className="lo-mini-bar purple" style={{ height: "50%" }}></div>
              <div className="lo-mini-bar purple" style={{ height: "80%" }}></div>
              <div className="lo-mini-bar purple" style={{ height: "70%" }}></div>
              <div className="lo-mini-bar purple" style={{ height: "45%" }}></div>
            </div>
            <div className="lo-mini-bar-labels">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
          </div>
        </div>

        {/* HABITS ROW */}
        <div className="lo-habits-row">
          <div className="lo-module-intro lo-habits-intro">
            <div className="label" style={{ color: "#b45309" }}>Habits</div>
            <h3 style={{ color: "#78350f" }}>Small Steps, Big Changes</h3>
            <p style={{ color: "#92400e" }}>Consistency is the key. Track your daily habits and build a better you.</p>
            <button className="lo-module-btn" style={{ borderColor: "#b45309", color: "#b45309" }} onClick={() => navigate("/gym/dashboard")}>
              Create a Habit
            </button>
          </div>

          <div className="lo-module-content">
            <div className="lo-module-content-header">
              <h4>Today's Habits</h4>
              <span style={{ fontSize: "0.8rem", color: "var(--lo-text-secondary)" }}>
                {completedCount} / {habits.length} completed
              </span>
            </div>
            <div className="lo-habits-progress-bar">
              <div 
                className="lo-habits-progress-fill" 
                style={{ width: `${habitsPercent}%` }}
              ></div>
            </div>
            <div className="lo-habits-list">
              {habits.map((habit) => (
                <div 
                  className="lo-habits-list-item" 
                  key={habit.id} 
                  onClick={() => toggleHabitState(habit.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="lo-habits-list-left">
                    <div className={`lo-habits-checkbox ${habit.completed ? "done" : "pending"}`}>
                      {habit.completed && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span 
                      className="lo-habits-list-name" 
                      style={{ textDecoration: habit.completed ? "line-through" : "none", color: habit.completed ? "var(--lo-text-secondary)" : "var(--lo-text)" }}
                    >
                      {habit.name}
                    </span>
                  </div>
                  <ChevronRight size={16} className="lo-habits-list-arrow" />
                </div>
              ))}
            </div>
          </div>

          <div className="lo-streak-card">
            <h4>Current Streak</h4>
            <div className="lo-streak-fire">🔥</div>
            <div className="lo-streak-number">
              12 <small>Days</small>
            </div>
            <div style={{ position: "relative", width: "120px", height: "60px", margin: "16px auto 8px", overflow: "hidden" }}>
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "6px dashed #e5e7eb",
                position: "absolute",
                top: 0,
                left: 0
              }}></div>
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "6px solid var(--lo-accent)",
                borderBottomColor: "transparent",
                borderLeftColor: "transparent",
                position: "absolute",
                top: 0,
                left: 0,
                transform: "rotate(45deg)"
              }}></div>
            </div>
            <div className="lo-streak-best">Best: 28 Days</div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="lo-cta">
        <div className="lo-cta-inner">
          <div>
            <h3>Ready to start your journey?</h3>
            <p>Join thousands of people improving their lives one habit and hobby at a time.</p>
          </div>
          <button className="lo-cta-btn" onClick={() => navigate("/register")}>
            Get Started Free <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="lo-footer">
        <div className="lo-footer-brand">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--lo-primary)", fontWeight: "800" }}>
            <Sparkles size={20} />
            <span>LifeOS</span>
          </div>
          <small>Your Life. Organized. Simplified. Improved.</small>
        </div>
        <div className="lo-footer-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/gym/dashboard"); }}>Habits</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/art-zone"); }}>Hobbies</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/finance/dashboard"); }}>Stats</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/planner"); }}>Planner</a>
        </div>
        <div className="lo-footer-love">
          Made with <span>❤️</span> for a better you.
        </div>
      </footer>
    </div>
  );
}