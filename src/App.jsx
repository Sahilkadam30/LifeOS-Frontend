import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ArtZone from "./pages/ArtZone";
import AddArt from "./pages/AddArt";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LifeOSIntroAnimation from "./pages/LifeOSIntroAnimation";
import TravelFeed from "./pages/TravelFeed";
import AddJourney from "./pages/AddJourney";
import VisitedPlace from "./pages/VisitedPlace";
import Dashboard from "./pages/Dashboard";
import ManageTrip from "./pages/ManageTrip";
import "leaflet/dist/leaflet.css";
import { Provider } from "react-redux";
import { store, persistor } from "./components/store/auth.store";
import { PersistGate } from "redux-persist/integration/react";
import "leaflet-geosearch/dist/geosearch.css";
import TravelSections from "./pages/TravelSections";
import WritingsPage from "./pages/WritingsPage"
import GymDashboard from "./pages/gym/GymDashboard";
import WorkoutLog from "./pages/gym/WorkoutLog";
import FitnessGoals from "./pages/gym/FitnessGoals"
import MealPlanPage from "./pages/gym/MealPlanPage";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import ExpenseTrackerPage from "./pages/finance/ExpenseTrackerPage";
import SavingsTrackerPage from "./pages/finance/SavingsTrackerPage";
import InvestmentTrackerPage from "./pages/finance/InvestmentTrackerPage";

import PlannerDashboard from "./pages/planner/PlannerDashboard";
import TaskManagerPage from "./pages/planner/TaskManagerPage";
import CalendarPage from "./pages/planner/CalendarPage";
import DeadlineTrackerPage from "./pages/planner/DeadlineTrackerPage";

import ProtectedRoute from "./components/ProtectedRoute";
import TravelSidebar from "./components/TravelSidebar";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LifeOSIntroAnimation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/home" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/travel" element={<ProtectedRoute><VisitedPlace /></ProtectedRoute>} />

            <Route path="/travelfeed" element={<ProtectedRoute><TravelFeed /></ProtectedRoute>} />
            <Route path="/add-journey" element={<ProtectedRoute><AddJourney /></ProtectedRoute>} />
            <Route path="/art-zone" element={<ProtectedRoute><ArtZone /></ProtectedRoute>} />
            <Route path="/add-art" element={<ProtectedRoute><AddArt /></ProtectedRoute>} />
            <Route path="/manage-trip" element={<ProtectedRoute><ManageTrip /></ProtectedRoute>} />
            <Route path="/TravelSections" element={<ProtectedRoute><TravelSections /></ProtectedRoute>} />
            <Route path="/WritingsPage" element={<ProtectedRoute><WritingsPage /></ProtectedRoute>} />
            <Route path="/gym/dashboard" element={<ProtectedRoute><GymDashboard /></ProtectedRoute>} />
            <Route path="/gym/workouts" element={<ProtectedRoute><WorkoutLog /></ProtectedRoute>} />
            <Route path="/gym/goals" element={<ProtectedRoute><FitnessGoals /></ProtectedRoute>} />
            <Route path="/gym/meals" element={<ProtectedRoute><MealPlanPage /></ProtectedRoute>} />
            <Route path="/finance/dashboard" element={<ProtectedRoute><FinanceDashboard /></ProtectedRoute>} />
            <Route path="/finance/expenses" element={<ProtectedRoute><ExpenseTrackerPage /></ProtectedRoute>} />
            <Route path="/finance/savings" element={<ProtectedRoute><SavingsTrackerPage /></ProtectedRoute>} />
            <Route path="/finance/investments" element={<ProtectedRoute><InvestmentTrackerPage /></ProtectedRoute>} />

            <Route path="/planner" element={<ProtectedRoute><PlannerDashboard /></ProtectedRoute>} />
            <Route path="/planner/tasks" element={<ProtectedRoute><TaskManagerPage /></ProtectedRoute>} />
            <Route path="/planner/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
            <Route path="/planner/deadlines" element={<ProtectedRoute><DeadlineTrackerPage /></ProtectedRoute>} />



          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
