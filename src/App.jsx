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
import AddVisited from "./pages/AddVisited";
import AddWishlist from "./pages/AddWishlist";
import Dashboard from "./pages/Dashboard";
import "leaflet/dist/leaflet.css";
import { Provider } from "react-redux";
import { store, persistor } from "./components/store/auth.store";
import { PersistGate } from "redux-persist/integration/react";

import ProtectedRoute from "./components/ProtectedRoute";

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
          <Route path="/add-visited" element={<ProtectedRoute><AddVisited /></ProtectedRoute>} />
          <Route path="/add-wishlist" element={<ProtectedRoute><AddWishlist /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
