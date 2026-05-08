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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LifeOSIntroAnimation />} />
        <Route path="/home" element={<Dashboard/>} />
        <Route path="/travel" element={<VisitedPlace/>} />
        <Route path="/travelfeed" element={<TravelFeed/>} />
        <Route path="/add-journey" element={<AddJourney />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/art-zone" element={<ArtZone />} />
        <Route path="/add-art" element={<AddArt />} />
        <Route path="/add-visited" element={<AddVisited />} />
        <Route path="/add-wishlist" element={<AddWishlist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
