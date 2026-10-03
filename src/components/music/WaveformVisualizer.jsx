import React from "react";

const BARS_COUNT = 28;
// Pre-computed heights to render a natural audio wave curve when idle
const BASE_HEIGHTS = [
  25, 40, 60, 35, 75, 90, 65, 45, 80, 100, 85, 70, 95, 80,
  60, 90, 75, 50, 85, 95, 60, 40, 70, 55, 35, 50, 30, 20
];

export default function WaveformVisualizer({ isPlaying = false, progressPercent = 0, color = "#10B981" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
        height: 38,
        width: "100%",
        padding: "4px 8px",
        background: "rgba(15, 23, 42, 0.45)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {BASE_HEIGHTS.map((height, idx) => {
        const barPercent = (idx / BARS_COUNT) * 100;
        const isPassed = barPercent <= progressPercent;

        return (
          <span
            key={idx}
            style={{
              flex: 1,
              minWidth: 2,
              maxWidth: 4,
              height: `${height}%`,
              borderRadius: 3,
              backgroundColor: isPassed
                ? color
                : "rgba(148, 163, 184, 0.28)",
              transition: isPlaying ? "height 0.15s ease, background-color 0.2s" : "all 0.3s ease",
              animation: isPlaying
                ? `musicWave ${(idx % 5) * 0.18 + 0.5}s ease-in-out infinite alternate`
                : "none",
            }}
          />
        );
      })}
      <style>
        {`
          @keyframes musicWave {
            0% { transform: scaleY(0.3); opacity: 0.7; }
            50% { transform: scaleY(1.1); opacity: 1; }
            100% { transform: scaleY(0.4); opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
}
