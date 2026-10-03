import React, { useRef, useState, useEffect } from "react";
import {
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import WaveformVisualizer from "./WaveformVisualizer";

function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function AudioPlayer({
  src,
  recordingId,
  title,
  initialDuration = 0,
  activePlayerId,
  onPlay,
  accentColor = "#10B981",
  showWaveform = true,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If another player became active, pause this one
  useEffect(() => {
    if (activePlayerId !== undefined && activePlayerId !== recordingId && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, [activePlayerId, recordingId, isPlaying]);

  useEffect(() => {
    if (initialDuration && (!duration || duration === 0)) {
      setDuration(initialDuration);
    }
  }, [initialDuration, duration]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (onPlay) {
        onPlay(recordingId);
      }
      setIsLoading(true);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Playback error:", err);
          setIsPlaying(false);
          setIsLoading(false);
        });
    }
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      togglePlay();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
    setIsLoading(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPercent = Math.max(0, Math.min(1, clickX / width));
    const newTime = newPercent * (duration || 1);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
        padding: "10px 12px",
        background: "rgba(10, 25, 47, 0.75)",
        borderRadius: 12,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(6px)",
      }}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      />

      {showWaveform && (
        <WaveformVisualizer
          isPlaying={isPlaying}
          progressPercent={progressPercent}
          color={accentColor}
        />
      )}

      {/* Progress Bar */}
      <div
        onClick={handleSeek}
        style={{
          position: "relative",
          width: "100%",
          height: 6,
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          borderRadius: 4,
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPercent}%`,
            background: `linear-gradient(90deg, ${accentColor}, #3B82F6)`,
            borderRadius: 4,
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* Controls Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Play"}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              background: `linear-gradient(135deg, ${accentColor}, #2563EB)`,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {isPlaying ? (
              <FiPause style={{ fontSize: 16 }} />
            ) : (
              <FiPlay style={{ fontSize: 16, marginLeft: 2 }} />
            )}
          </button>

          {/* Restart Button */}
          <button
            type="button"
            onClick={handleRestart}
            title="Restart"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: "transparent",
              color: "#94A3B8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#94A3B8";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
          >
            <FiRotateCcw style={{ fontSize: 13 }} />
          </button>

          {/* Time Display */}
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "#94A3B8",
              letterSpacing: "0.5px",
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Volume & Status */}
        <div
          style={{ position: "relative", display: "flex", alignItems: "center", gap: 6 }}
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          {showVolumeSlider && (
            <div
              style={{
                position: "absolute",
                bottom: 30,
                right: -10,
                background: "#071B3A",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                zIndex: 20,
              }}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{
                  width: 70,
                  height: 4,
                  accentColor: accentColor,
                  cursor: "pointer",
                }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            style={{
              background: "none",
              border: "none",
              color: isMuted ? "#EF4444" : "#94A3B8",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = isMuted ? "#EF4444" : "#94A3B8")
            }
          >
            {isMuted || volume === 0 ? (
              <FiVolumeX style={{ fontSize: 16 }} />
            ) : (
              <FiVolume2 style={{ fontSize: 16 }} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
