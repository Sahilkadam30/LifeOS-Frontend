import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ArtZone from "./pages/ArtZone";
import AddArt from "./pages/AddArt";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LifeOSIntroAnimation from "./pages/LifeOSIntroAnimation";
import TravelFeed from "./pages/TravelFeed";
import AddJourney from "./pages/AddJourney";
import VisitedPlace from "./pages/visitedplace";
import AddVisited from "./pages/AddVisited";
import MapView from "./components/MapView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LifeOSIntroAnimation />} />
        <Route path="/home" element={<VisitedPlace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
