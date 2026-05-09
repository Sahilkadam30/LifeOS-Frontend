import React, { useEffect, useState } from "react";
import "../styles/LifeOSIntroAnimation.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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

  const token = useSelector((state) => state.auth.token);

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
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 2000);

    // Redirect after animation
    const redirectTimer = setTimeout(() => {

      if (token) {
        navigate("/home");
      } else {
        navigate("/login");
      }

    }, 3000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(redirectTimer);
    };

  }, [navigate, token]);

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