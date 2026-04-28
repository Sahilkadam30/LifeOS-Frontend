import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ArtZone from "./pages/ArtZone";
import AddArt from "./pages/AddArt";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LifeOSIntroAnimation from "./pages/LifeOSIntroAnimation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LifeOSIntroAnimation />} />
        <Route path="/home" element={<ArtZone />} />
        <Route path="/add-art" element={<AddArt />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;