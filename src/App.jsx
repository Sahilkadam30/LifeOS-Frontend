import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import TravelPage from "./pages/TravelPage";
import "leaflet/dist/leaflet.css";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import LifeOSIntroAnimation from "./pages/LifeOSIntroAnimation"; // ✅ fixed

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LifeOSIntroAnimation />} />
        <Route path="/home" element={<CreatePost />} />
        <Route path="/travel" element={<TravelPage />} />
        <Route path="/feed" element={<Feed />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;