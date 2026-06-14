import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../api";
import imageCompression from "browser-image-compression";
import { logout } from "../components/store/slice/auth.slice";
import {
  FiMap, FiCompass, FiHeart, FiBarChart2,
  FiAward, FiHome, FiLogOut, FiArrowLeft,
  FiUploadCloud, FiX, FiChevronLeft, FiChevronRight,
} from "react-icons/fi";

/* ─── Sidebar ─────────────────────────────────────── */
const menuItems = [
  { id: "feed",     label: "Journey Feed",  icon: FiCompass, path: "/travelfeed" },
  { id: "map",      label: "Map View",      icon: FiMap,     path: "/travel"     },
  { id: "visited",  label: "Visited Trips", icon: FiAward,   path: "/travel"     },
  { id: "wishlist", label: "Wishlist",      icon: FiHeart,   path: "/travel"     },
  { id: "stats",    label: "Statistics",   icon: FiBarChart2,path: "/travel"     },
];

function TravelSidebarLocal({ active }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => { dispatch(logout()); navigate("/login"); };

  return (
    <aside style={{
      width: 280, minWidth: 280, background: "#071B3A",
      minHeight: "100vh", height: "100vh", position: "sticky", top: 0,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "28px 16px", borderRight: "1px solid rgba(255,255,255,0.05)",
      fontFamily: "'Inter','Manrope',sans-serif",
    }}>
      <div>
        <div onClick={() => navigate("/travel")} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, paddingLeft: 8, cursor: "pointer" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#2563EB,#00C853)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiMap style={{ color: "#fff", fontSize: 20 }} />
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0, lineHeight: 1.2 }}>Trip Journal</p>
            <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>Travel Companion</p>
          </div>
        </div>

        <p style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: 12, marginBottom: 8 }}>Navigation</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <div key={item.id} onClick={() => navigate(item.path)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                background: isActive ? "rgba(0,200,83,0.15)" : "transparent",
                borderLeft: isActive ? "3px solid #00C853" : "3px solid transparent",
                color: isActive ? "#00C853" : "#94A3B8",
                fontWeight: isActive ? 600 : 400, fontSize: 14,
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; } }}
              >
                <Icon style={{ fontSize: 16, flexShrink: 0 }} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={() => navigate("/home")} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)",
          cursor: "pointer", background: "transparent", color: "#94A3B8",
          fontSize: 14, textAlign: "left", fontFamily: "inherit", transition: "all 0.2s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
        >
          <FiHome style={{ fontSize: 16 }} /> Back to Home
        </button>
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />
        <button onClick={handleLogout} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "11px 14px", borderRadius: 10, border: "none",
          cursor: "pointer", background: "transparent", color: "#EF4444",
          fontSize: 14, textAlign: "left", fontFamily: "inherit", transition: "all 0.2s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <FiLogOut style={{ fontSize: 16 }} /> Logout
        </button>
      </div>
    </aside>
  );
}

/* ─── Input helper ────────────────────────────────── */
const inputStyle = {
  width: "100%", padding: "12px 16px", fontSize: 15,
  border: "1px solid #E2E8F0", borderRadius: 10,
  background: "#F8FAFC", color: "#1E293B", outline: "none",
  fontFamily: "inherit", transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};
const labelStyle = {
  display: "block", fontSize: 12, fontWeight: 700,
  color: "#64748B", textTransform: "uppercase",
  letterSpacing: "0.07em", marginBottom: 8,
};
const focusIn  = (e) => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)"; e.target.style.background = "#fff"; };
const focusOut = (e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; e.target.style.background = "#F8FAFC"; };

/* ─── Main Page ───────────────────────────────────── */
export default function AddJourney() {
  const navigate = useNavigate();

  const [placeName,   setPlaceName]   = useState("");
  const [caption,     setCaption]     = useState("");
  const [images,      setImages]      = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [isDragging,  setIsDragging]  = useState(false);
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const processImages = async (files) => {
    const compressed = [], previews = [];
    for (const file of files) {
      const c = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true });
      compressed.push(c);
      previews.push(URL.createObjectURL(c));
    }
    setImages((p) => [...p, ...compressed]);
    setPreviewUrls((p) => [...p, ...previews]);
  };

  const handleDrop = async (e) => {
    e.preventDefault(); setIsDragging(false);
    await processImages(Array.from(e.dataTransfer.files));
  };
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true);  };
  const handleDragLeave = ()  => setIsDragging(false);
  const handleInput     = async (e) => await processImages(Array.from(e.target.files));

  const removeImage = (i) => {
    const ni = [...images];  ni.splice(i, 1);
    const np = [...previewUrls]; np.splice(i, 1);
    setImages(ni); setPreviewUrls(np);
  };

  const moveImage = (i, dir) => {
    const ni = [...images], np = [...previewUrls];
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    [ni[i], ni[j]] = [ni[j], ni[i]];
    [np[i], np[j]] = [np[j], np[i]];
    setImages(ni); setPreviewUrls(np);
  };

  const handleSubmit = async () => {
    if (!placeName.trim()) { showToast("Please enter a place name."); return; }
    if (!caption.trim())   { showToast("Please enter a caption."); return; }
    if (!images.length)    { showToast("Please add at least one image."); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("placeName", placeName);
      fd.append("caption", caption);
      images.forEach((img) => fd.append("images", img));

      await API.post("/travel/post", fd, {
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });

      showToast("Journey uploaded successfully! 🎉", "success");
      setTimeout(() => navigate("/travelfeed"), 1200);
    } catch (err) {
      console.error(err);
      showToast("Upload failed. Please try again.");
    } finally {
      setLoading(false); setProgress(0);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F7FA", fontFamily: "'Inter','Manrope',sans-serif" }}>
      <TravelSidebarLocal active="feed" />

      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {/* ── Header ─────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <button onClick={() => navigate("/travelfeed")} style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 500, color: "#64748B",
            background: "none", border: "none", cursor: "pointer",
            marginBottom: 10, padding: 0, fontFamily: "inherit",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#1E293B"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#64748B"; }}
          >
            <FiArrowLeft size={15} /> Journey Feed
          </button>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1E293B", margin: "0 0 6px" }}>Add New Journey</h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: 0 }}>Document your travel memories with photos and notes.</p>
        </div>

        {/* ── Toast ──────────────────────────── */}
        {toast && (
          <div style={{
            position: "fixed", top: 24, right: 24, zIndex: 999,
            background: toast.type === "success" ? "#16A34A" : "#EF4444",
            color: "#fff", borderRadius: 12, padding: "14px 22px",
            fontSize: 14, fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            animation: "fadeIn 0.3s ease",
          }}>
            {toast.msg}
          </div>
        )}

        {/* ── Form Card ─────────────────────── */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 24, alignItems: "start",
        }}>
          {/* LEFT — Fields */}
          <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1E293B", margin: "0 0 24px" }}>Journey Details</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={labelStyle}>Place Name *</label>
                <input style={inputStyle} type="text" placeholder="e.g. Santorini, Greece"
                  value={placeName} onChange={(e) => setPlaceName(e.target.value)}
                  onFocus={focusIn} onBlur={focusOut} />
              </div>

              <div>
                <label style={labelStyle}>Caption *</label>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 110 }}
                  placeholder="Describe your journey experience…"
                  value={caption} onChange={(e) => setCaption(e.target.value)}
                  onFocus={focusIn} onBlur={focusOut} />
              </div>

              {/* Progress bar */}
              {loading && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748B", marginBottom: 8, fontWeight: 500 }}>
                    <span>Uploading…</span>
                    <span style={{ color: "#2563EB", fontWeight: 700 }}>{progress}%</span>
                  </div>
                  <div style={{ width: "100%", height: 8, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#2563EB,#00C853)", borderRadius: 99, transition: "width 0.4s ease" }} />
                  </div>
                </div>
              )}

              {/* Submit */}
              <button onClick={handleSubmit} disabled={loading} style={{
                width: "100%", padding: "14px", background: loading ? "#93C5FD" : "#2563EB",
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.3)",
                transition: "all 0.25s", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
                onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = "#1D4ED8"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.background = "#2563EB"; e.currentTarget.style.transform = "none"; } }}
              >
                {loading ? (
                  <><span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Uploading…</>
                ) : (
                  <><FiUploadCloud style={{ fontSize: 18 }} /> Publish Journey</>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT — Image Upload */}
          <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1E293B", margin: "0 0 20px" }}>Upload Photos</h2>

            {/* Drop Zone */}
            <label style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              border: `2px dashed ${isDragging ? "#2563EB" : "#CBD5E1"}`,
              borderRadius: 14, padding: "36px 20px",
              background: isDragging ? "#EFF6FF" : "#F8FAFC",
              cursor: "pointer", transition: "all 0.25s", marginBottom: 20,
            }}
              onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
            >
              <FiUploadCloud style={{ fontSize: 40, color: isDragging ? "#2563EB" : "#94A3B8", marginBottom: 12 }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: isDragging ? "#2563EB" : "#475569", margin: "0 0 4px" }}>
                {isDragging ? "Drop images here!" : "Drag & Drop images"}
              </p>
              <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>or click to browse files</p>
              <input type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleInput} />
            </label>

            {/* Preview Grid */}
            {previewUrls.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {previewUrls.map((url, i) => (
                  <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid #E2E8F0", aspectRatio: "1" }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                    {/* Overlay controls */}
                    <div style={{
                      position: "absolute", inset: 0, background: "rgba(7,27,58,0.55)",
                      opacity: 0, transition: "opacity 0.2s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = 0; }}
                    >
                      <button onClick={() => moveImage(i, -1)} disabled={i === 0} style={controlBtnStyle}>
                        <FiChevronLeft size={14} />
                      </button>
                      <button onClick={() => removeImage(i)} style={{ ...controlBtnStyle, background: "#EF4444" }}>
                        <FiX size={14} />
                      </button>
                      <button onClick={() => moveImage(i, 1)} disabled={i === previewUrls.length - 1} style={controlBtnStyle}>
                        <FiChevronRight size={14} />
                      </button>
                    </div>

                    {/* Order badge */}
                    <div style={{
                      position: "absolute", top: 6, left: 6,
                      background: "#071B3A", color: "#fff",
                      fontSize: 10, fontWeight: 700,
                      padding: "2px 7px", borderRadius: 99,
                    }}>
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {previewUrls.length === 0 && (
              <p style={{ fontSize: 13, color: "#94A3B8", textAlign: "center", margin: 0 }}>No images selected yet.</p>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

const controlBtnStyle = {
  width: 28, height: 28, borderRadius: "50%",
  background: "rgba(255,255,255,0.15)",
  border: "none", color: "#fff",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", transition: "background 0.2s",
};