import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LayoutDashboard, Dumbbell, Target, Home, LogOut } from "lucide-react";
import { logout } from "../store/slice/auth.slice";

export default function GymSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-[#E6F4EA] text-[#059669] shadow-sm"
        : "text-[#666] hover:bg-[#F8F6F4] hover:text-[#222]"
    }`;

  return (
    <div className="flex flex-col justify-between w-[240px] bg-white border-r border-[#ECECEC] p-5 shrink-0 min-h-screen font-['Inter']">
      <div>
        <h1 
          className="text-3xl font-['Playfair_Display'] font-bold text-[#222] mb-8 cursor-pointer hover:opacity-85"
          onClick={() => navigate("/gym/dashboard")}
        >
          Fitness Hub
        </h1>

        <div className="space-y-2">
          <NavLink to="/gym/dashboard" className={linkClass}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/gym/workouts" className={linkClass}>
            <Dumbbell size={18} />
            <span>Workout Log</span>
          </NavLink>

          <NavLink to="/gym/goals" className={linkClass}>
            <Target size={18} />
            <span>Fitness Goals</span>
          </NavLink>

          <NavLink to="/gym/meals" className={linkClass}>
            <Target size={18} />
            <span>Meal Planner</span>
          </NavLink>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold border border-[#E0E0E0] text-[#555] hover:bg-[#F8F6F4] transition duration-200 cursor-pointer"
        >
          <Home size={16} />
          <span>Back to Home</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold bg-[#059669] text-white hover:bg-[#047857] transition duration-200 cursor-pointer shadow-sm shadow-emerald-100"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}