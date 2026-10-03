import React from "react";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import { RECORDING_TYPE_INFO } from "./RecordingCard";

const CATEGORY_TABS = [
  { id: "ALL", label: "All", icon: "🎵" },
  { id: "SONG", label: "Songs", icon: "🎼" },
  { id: "SINGING", label: "Singing", icon: "🎤" },
  { id: "GUITAR", label: "Guitar", icon: "🎸" },
  { id: "PIANO", label: "Piano", icon: "🎹" },
  { id: "KEYBOARD", label: "Keyboard", icon: "🎹" },
  { id: "DRUMS", label: "Drums", icon: "🥁" },
  { id: "OTHER_INSTRUMENT", label: "Instruments", icon: "🎺" },
  { id: "MUSIC_IDEA", label: "Ideas", icon: "💡" },
  { id: "PRACTICE", label: "Practice", icon: "⏱️" },
];

export default function RecordingFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  showFavoritesOnly,
  setShowFavoritesOnly,
  totalResults = 0,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        marginBottom: 24,
      }}
    >
      {/* Top Search & Sort Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            position: "relative",
            flex: "1 1 280px",
            maxWidth: 460,
          }}
        >
          <FiSearch
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748B",
              fontSize: 16,
            }}
          />
          <input
            type="text"
            placeholder="Search recordings, types, or practice notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 38px 10px 40px",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: 10,
              color: "#1E293B",
              fontSize: 14,
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#10B981")}
            onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#64748B",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <FiX style={{ fontSize: 14 }} />
            </button>
          )}
        </div>

        {/* Sort & Quick Filter Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 14px",
              borderRadius: 10,
              border: showFavoritesOnly
                ? "1px solid rgba(239, 68, 68, 0.5)"
                : "1px solid #E2E8F0",
              background: showFavoritesOnly
                ? "rgba(239, 68, 68, 0.1)"
                : "#F8FAFC",
              color: showFavoritesOnly ? "#EF4444" : "#64748B",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span>❤️</span>
            <span>Favorites</span>
          </button>

          {/* Sort Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FiSliders style={{ color: "#64748B", fontSize: 15 }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "9px 12px",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                color: "#1E293B",
                fontSize: 13,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title_asc">Title (A-Z)</option>
              <option value="title_desc">Title (Z-A)</option>
              <option value="longest">Longest Duration</option>
              <option value="shortest">Shortest Duration</option>
            </select>
          </div>

          <span style={{ color: "#64748B", fontSize: 12, marginLeft: 4 }}>
            {totalResults} {totalResults === 1 ? "track" : "tracks"}
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "thin",
        }}
      >
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 20,
                border: isActive
                  ? "1px solid #10B981"
                  : "1px solid #E2E8F0",
                background: isActive
                  ? "rgba(16, 185, 129, 0.12)"
                  : "#F8FAFC",
                color: isActive ? "#059669" : "#64748B",
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "#1E293B";
                  e.currentTarget.style.borderColor = "#CBD5E1";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "#64748B";
                  e.currentTarget.style.borderColor = "#E2E8F0";
                }
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
