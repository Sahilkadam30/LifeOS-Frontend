import React, { useEffect, useState } from "react";
import "../styles/LifeOSIntroAnimation.css";
import { useNavigate } from "react-router-dom";

const lines = [
  "Learning something new ✨",
  "Building my future 🚀",
  "Consistency creates success 🌱",
  "Tracking my growth 📈",
  "Ideas turning into reality 💡",
  "Be better than yesterday 🔥"
];

const LifeOSIntroAnimation = () => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showText, setShowText] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let index = localStorage.getItem("lifeos_line_index");

    if (index === null) {
      index = 0;
    } else {
      index = (parseInt(index) + 1) % lines.length;
    }

    localStorage.setItem("lifeos_line_index", index);
    setCurrentLineIndex(index);

    // Show text after logo
    setTimeout(() => {
      setShowText(true);
    }, 2000);

    // 🔥 Auto redirect after 3 sec
    setTimeout(() => {
      navigate("/home"); // change route if needed
    }, 3000);

  }, [navigate]);

  return (
    <div className="lifeos-container">
      <h1 className="lifeos-logo">
        {"LifeOS".split("").map((char, index) => (
          <span key={index} className="letter">
            {char}
          </span>
        ))}
      </h1>

      {showText && <div className="lifeos-divider"></div>}

      {showText && (
        <p className="lifeos-line">
          {lines[currentLineIndex]}
        </p>
      )}
    </div>
  );
};

export default LifeOSIntroAnimation;