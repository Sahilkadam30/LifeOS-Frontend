import React from "react";
import { Routes, Route } from "react-router-dom";
import TravelPage from "./pages/TravelPage";
import "leaflet/dist/leaflet.css";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import LifeOSIntroAnimation from "./pages/LifeOSIntroAnimation"; // ✅ fixed

function App() {
  return (
    <Routes>
      <Route path="/" element={<LifeOSIntroAnimation />} />
      <Route path="/home" element={<CreatePost />} />
    </Routes>
  );
}

export default App;