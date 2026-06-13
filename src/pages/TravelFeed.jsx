import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Heart, MessageSquare, Trash2, Calendar, Plus, ArrowLeft } from "lucide-react";
import { logout } from "../components/store/slice/auth.slice";
import API from "../api";
import FloatingButton from "../components/FloatingButton";
import "../styles/TravelFeed.css";

import { FiMap, FiCompass, FiHeart, FiBarChart2, FiAward, FiHome, FiLogOut, FiSettings } from "react-icons/fi";

/* ─── Sidebar ─────────────────────────────────────── */
const menuItems = [
  { id: "feed",    label: "Journey Feed",   icon: FiCompass, path: "/travelfeed" },
  { id: "map",     label: "Map View",       icon: FiMap,     path: "/travel"     },
  { id: "visited", label: "Visited Trips",  icon: FiAward,   path: "/travel"     },
  { id: "wishlist",label: "Wishlist",       icon: FiHeart,   path: "/travel"     },
  { id: "stats",   label: "Statistics",     icon: FiBarChart2,path: "/travel"    },
];

function TravelFeedSidebar({ active }) {
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
        {/* Logo */}
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
          fontSize: 14, textAlign: "left", transition: "all 0.2s", fontFamily: "inherit",
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
          fontSize: 14, textAlign: "left", transition: "all 0.2s", fontFamily: "inherit",
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

/* ─── Main Page ───────────────────────────────────── */
export default function TravelFeed() {
  const [posts,        setPosts]        = useState([]);
  const [likedPosts,   setLikedPosts]   = useState({});
  const [showHeart,    setShowHeart]    = useState({});
  const [currentIndex, setCurrentIndex] = useState({});
  const [commentText,  setCommentText]  = useState({});
  const [showComments, setShowComments] = useState({});
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [currentUser,  setCurrentUser]  = useState("");

  const token    = useSelector((s) => s.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchPosts = async () => {
    try { const res = await API.get("/travel/my"); setPosts(res.data); }
    catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    try {
      fetchPosts();
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUser(payload.sub);
    } catch { navigate("/login"); }
  }, [token]);

  const likePost = async (postId) => {
    try {
      const res = await API.post(`/travel/like/${postId}`);
      setPosts(posts.map((p) => p.id === postId ? { ...p, likeCount: res.data } : p));
      setLikedPosts((prev) => ({ ...prev, [postId]: true }));
    } catch (err) { console.error(err); }
  };

  const handleDoubleTap = (postId) => {
    likePost(postId);
    setShowHeart((prev) => ({ ...prev, [postId]: true }));
    setTimeout(() => setShowHeart((prev) => ({ ...prev, [postId]: false })), 800);
  };

  const addComment = async (postId) => {
    try {
      const text = commentText[postId];
      if (!text) return;
      const res = await API.post(`/travel/comment/${postId}`, text, { headers: { "Content-Type": "text/plain" } });
      setPosts(posts.map((p) => p.id === postId ? { ...p, comments: [...(p.comments || []), res.data] } : p));
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) { console.error(err); }
  };

  const openDeletePopup  = (id) => { setSelectedPostId(id); setShowConfirm(true); };
  const cancelDelete     = () => { setShowConfirm(false); setSelectedPostId(null); };
  const confirmDelete    = async () => {
    try {
      await API.delete(`/travel/post/${selectedPostId}`);
      setPosts((prev) => prev.filter((p) => p.id !== selectedPostId));
      setShowConfirm(false);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F7FA", fontFamily: "'Inter','Manrope',sans-serif" }}>
      <TravelFeedSidebar active="feed" />

      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        {/* ── Page Header ─────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <button onClick={() => navigate("/travel")} style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 13, fontWeight: 500, color: "#64748B",
              background: "none", border: "none", cursor: "pointer",
              marginBottom: 8, padding: 0, fontFamily: "inherit",
              transition: "color 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#1E293B"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#64748B"; }}
            >
              <ArrowLeft size={15} /> Travel Dashboard
            </button>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1E293B", margin: "0 0 6px", lineHeight: 1.2 }}>Journey Feed</h1>
            <p style={{ fontSize: 15, color: "#64748B", margin: 0 }}>Browse your personal journal records, pictures, and expedition notes.</p>
          </div>

          <button onClick={() => navigate("/add-journey")} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#2563EB", color: "#fff",
            border: "none", borderRadius: 10, padding: "12px 22px",
            fontSize: 15, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(37,99,235,0.28)",
            transition: "all 0.25s", fontFamily: "inherit",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1D4ED8"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(37,99,235,0.35)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#2563EB"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.28)"; }}
          >
            <Plus size={16} /> Add Journey
          </button>
        </div>

        {/* ── Empty State ─────────────────────── */}
        {posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#94A3B8" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✈️</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#64748B" }}>No journeys yet</p>
            <p style={{ fontSize: 14 }}>Start adding your travel memories!</p>
          </div>
        )}

        {/* ── Posts Grid ──────────────────────── */}
        <div className="post-grid">
          {posts.map((post) => (
            <div key={post.id}>
              <div style={{
                background: "#FFFFFF", borderRadius: 16,
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px) scale(1.01)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.10)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}
              >
                {/* Image */}
                <div className="image-container" style={{ position: "relative", height: 260, overflow: "hidden", cursor: "pointer" }}
                  onDoubleClick={() => handleDoubleTap(post.id)}>
                  {showHeart[post.id] && (
                    <div className="heart-animation" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, zIndex: 25, pointerEvents: "none" }}>❤️</div>
                  )}
                  {post.images?.length > 1 && (
                    <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(7,27,58,0.82)", color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, zIndex: 10 }}>
                      {(currentIndex[post.id] || 0) + 1}/{post.images.length}
                    </div>
                  )}
                  {post.images?.length > 0 ? (
                    <Swiper spaceBetween={10} style={{ height: "100%", width: "100%" }}
                      onSlideChange={(s) => setCurrentIndex((prev) => ({ ...prev, [post.id]: s.activeIndex }))}>
                      {post.images.map((img) => (
                        <SwiperSlide key={img.id} style={{ height: "100%" }}>
                          <img src={img.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: 14 }}>
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: "18px 20px" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", margin: "0 0 6px", lineHeight: 1.4 }}>{post.caption}</h3>
                  <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 5, fontWeight: 500 }}>
                    <Calendar size={12} />
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>

                  {/* Action bar */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F1F5F9", paddingTop: 14 }}>
                    {/* Like */}
                    <button onClick={() => likePost(post.id)} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      fontSize: 13, fontWeight: 600, color: "#2563EB",
                      background: "none", border: "none", cursor: "pointer", padding: 0, transition: "transform 0.2s", fontFamily: "inherit",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
                    >
                      <Heart size={15} /> {post.likeCount || 0} Likes
                    </button>

                    {/* Comment */}
                    <button onClick={() => setShowComments((p) => ({ ...p, [post.id]: !p[post.id] }))} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      fontSize: 13, fontWeight: 600, color: "#64748B",
                      background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s", fontFamily: "inherit",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#1E293B"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#64748B"; }}
                    >
                      <MessageSquare size={15} /> {post.comments?.length || 0} Comments
                    </button>

                    {/* Delete */}
                    {post.user?.username === currentUser && (
                      <button onClick={() => openDeletePopup(post.id)} style={{
                        display: "flex", alignItems: "center", gap: 5,
                        fontSize: 13, color: "#94A3B8",
                        background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s", fontFamily: "inherit",
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#94A3B8"; }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>

                  {/* Comments panel */}
                  {showComments[post.id] && (
                    <div style={{ marginTop: 16, borderTop: "1px solid #F1F5F9", paddingTop: 14, animation: "fadeIn 0.3s ease" }}>
                      <div style={{ maxHeight: 160, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                        {post.comments?.map((c) => (
                          <div key={c.id} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px" }}>
                            <p style={{ margin: 0, fontSize: 13, color: "#334155", lineHeight: 1.4 }}>
                              <span style={{ fontWeight: 700, color: "#1E293B", marginRight: 4 }}>{c.user?.username}</span>
                              {c.text}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                        <input type="text"
                          style={{ flex: 1, padding: "10px 14px", background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#1E293B", fontFamily: "inherit" }}
                          placeholder="Add a comment…"
                          value={commentText[post.id] || ""}
                          onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                        />
                        <button onClick={() => addComment(post.id)} style={{
                          background: "#2563EB", color: "#fff",
                          border: "none", padding: "10px 18px",
                          fontSize: 13, fontWeight: 600, cursor: "pointer",
                          transition: "background 0.2s", fontFamily: "inherit",
                        }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#1D4ED8"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#2563EB"; }}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Delete Confirm Modal ─────────────── */}
      {showConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 999,
        }}>
          <div style={{
            background: "#FFFFFF", borderRadius: 20,
            border: "1px solid #E2E8F0",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            padding: "32px 28px", maxWidth: 360, width: "100%", textAlign: "center",
            animation: "popupFade 0.25s ease",
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", margin: "0 0 8px" }}>Delete Journey?</h3>
            <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px" }}>This action is permanent and cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={confirmDelete} style={{
                flex: 1, padding: "12px", background: "#EF4444", color: "#fff",
                border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "background 0.2s", fontFamily: "inherit",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#DC2626"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#EF4444"; }}
              >
                Yes, Delete
              </button>
              <button onClick={cancelDelete} style={{
                flex: 1, padding: "12px", background: "transparent", color: "#64748B",
                border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "background 0.2s", fontFamily: "inherit",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <FloatingButton onClick={() => navigate("/add-journey")} />
    </div>
  );
}
