import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ArtZone from "./pages/ArtZone";
import AddArt from "./pages/AddArt";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArtZone />} />
        <Route path="/a" element={<AddArt />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;