import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../components/store/slice/auth.slice";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import {
  getExploreFeed,
  toggleThoughtLike,
  addThoughtComment,
  deleteThoughtPost,
  toggleArtLike,
  addArtComment,
  createThoughtPost,
} from "../services/exploreService";
import {
  Compass,
  Palette,
  BookOpen,
  Heart,
  MessageSquare,
  Send,
  Plus,
  Search,
  Image as ImageIcon,
  Trash2,
  Home,
  LogOut,
  User as UserIcon,
  Sparkles,
  X,
  Share2,
  Calendar,
  Filter,
} from "lucide-react";

const ACCENT_COLORS = [
  "#2563EB",
  "#16A34A",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);
  const currentUsername = currentUser?.username || "You";

  // Data state
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL"); // "ALL" | "ART" | "POST"
  const [searchTerm, setSearchTerm] = useState("");

  // Interactions state
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [commentSubmitting, setCommentSubmitting] = useState({});
  const [likeAnimations, setLikeAnimations] = useState({});

  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { id, itemType }
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New post form state
  const [newPostForm, setNewPostForm] = useState({
    title: "",
    content: "",
    cardColor: ACCENT_COLORS[0],
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");

  // ================= LOAD FEED =================
  const loadFeed = async (filter = activeFilter) => {
    try {
      setLoading(true);
      const data = await getExploreFeed(filter);
      setFeed(data);
    } catch (err) {
      console.error("Failed to load explore feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed(activeFilter);
  }, [activeFilter]);

  // ================= SEARCH FILTER =================
  const filteredFeed = useMemo(() => {
    if (!searchTerm.trim()) return feed;
    const query = searchTerm.toLowerCase();
    return feed.filter((item) => {
      const matchTitle = item.title?.toLowerCase().includes(query);
      const matchContent = item.content?.toLowerCase().includes(query);
      const matchAuthor = item.username?.toLowerCase().includes(query) ||
                          item.authorFullName?.toLowerCase().includes(query);
      return matchTitle || matchContent || matchAuthor;
    });
  }, [feed, searchTerm]);

  // ================= LIKE INTERACTION =================
  const handleLike = async (item) => {
    const isArt = item.itemType === "ART";
    const prevLiked = item.liked;
    const prevCount = item.likesCount;

    // Optimistic UI update
    setFeed((prevFeed) =>
      prevFeed.map((p) => {
        if (p.id === item.id && p.itemType === item.itemType) {
          const nextLiked = !prevLiked;
          const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1);
          return { ...p, liked: nextLiked, likesCount: nextCount };
        }
        return p;
      })
    );

    // Heart bounce animation
    setLikeAnimations((prev) => ({ ...prev, [`${item.itemType}-${item.id}`]: true }));
    setTimeout(() => {
      setLikeAnimations((prev) => ({ ...prev, [`${item.itemType}-${item.id}`]: false }));
    }, 600);

    try {
      if (isArt) {
        const res = await toggleArtLike(item.id);
        setFeed((prevFeed) =>
          prevFeed.map((p) =>
            p.id === item.id && p.itemType === "ART"
              ? { ...p, likesCount: res.likesCount }
              : p
          )
        );
      } else {
        const res = await toggleThoughtLike(item.id);
        setFeed((prevFeed) =>
          prevFeed.map((p) =>
            p.id === item.id && p.itemType === "POST"
              ? { ...p, likesCount: res.likesCount }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Failed to like post:", err);
      // Rollback on error
      setFeed((prevFeed) =>
        prevFeed.map((p) =>
          p.id === item.id && p.itemType === item.itemType
            ? { ...p, liked: prevLiked, likesCount: prevCount }
            : p
        )
      );
    }
  };

  // ================= COMMENT INTERACTIONS =================
  const toggleCommentsView = (itemKey) => {
    setExpandedComments((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const handleCommentSubmit = async (item) => {
    const key = `${item.itemType}-${item.id}`;
    const text = (commentInputs[key] || "").trim();
    if (!text) return;

    try {
      setCommentSubmitting((prev) => ({ ...prev, [key]: true }));

      let newComment;
      if (item.itemType === "ART") {
        newComment = await addArtComment(item.id, text);
      } else {
        newComment = await addThoughtComment(item.id, text);
      }

      // Append comment to item
      setFeed((prevFeed) =>
        prevFeed.map((p) => {
          if (p.id === item.id && p.itemType === item.itemType) {
            const updatedComments = [...(p.comments || []), newComment];
            return {
              ...p,
              comments: updatedComments,
              commentsCount: updatedComments.length,
            };
          }
          return p;
        })
      );

      // Clear input
      setCommentInputs((prev) => ({ ...prev, [key]: "" }));
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setCommentSubmitting((prev) => ({ ...prev, [key]: false }));
    }
  };

  // ================= DELETE POST =================
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.itemType === "POST") {
        await deleteThoughtPost(itemToDelete.id);
      }
      setFeed((prevFeed) =>
        prevFeed.filter(
          (p) => !(p.id === itemToDelete.id && p.itemType === itemToDelete.itemType)
        )
      );
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // ================= CREATE THOUGHT POST =================
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostForm.title.trim() || !newPostForm.content.trim()) {
      setCreateError("Please provide both a title and thought content.");
      return;
    }

    try {
      setCreateSubmitting(true);
      setCreateError("");
      await createThoughtPost(newPostForm);
      setIsCreateModalOpen(false);
      setNewPostForm({ title: "", content: "", cardColor: ACCENT_COLORS[0] });
      // Reload feed to include new post
      loadFeed(activeFilter);
    } catch (err) {
      console.error("Failed to create thought post:", err);
      setCreateError("Failed to share your thought. Please try again.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Helper avatar initial
  const getInitials = (name) => {
    if (!name) return "U";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter',_sans-serif] flex">
      {/* SIDEBAR NAVIGATION */}
      <aside
        style={{
          width: 280,
          minWidth: 280,
          background: "#071B3A",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "28px 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div>
          {/* LOGO */}
          <div
            onClick={() => navigate("/home")}
            className="flex items-center gap-3 mb-10 px-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Compass className="text-white h-5 w-5 animate-spin-slow" />
            </div>
            <div>
              <p className="text-white font-black text-lg leading-tight tracking-tight">
                LifeOS Explore
              </p>
              <p className="text-slate-400 text-xs font-medium">
                Community Feed
              </p>
            </div>
          </div>

          {/* SECTION LABEL: EXPLORE FEEDS */}
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider px-3 mb-2">
            Feed Filter
          </p>

          <nav className="flex flex-col gap-1.5 mb-8">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left border ${
                activeFilter === "ALL"
                  ? "bg-blue-600/15 border-blue-500/40 text-blue-400 shadow-sm"
                  : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>All Community Feed</span>
            </button>

            <button
              onClick={() => setActiveFilter("ART")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left border ${
                activeFilter === "ART"
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm"
                  : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Palette className="h-4 w-4" />
              <span>Art Gallery Showcase</span>
            </button>

            <button
              onClick={() => setActiveFilter("POST")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left border ${
                activeFilter === "POST"
                  ? "bg-purple-500/15 border-purple-500/40 text-purple-400 shadow-sm"
                  : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Thoughts & Writings</span>
            </button>
          </nav>

          {/* SECTION LABEL: WORKSPACES */}
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider px-3 mb-2">
            Quick Workspaces
          </p>

          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => navigate("/WritingsPage")}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 text-left"
            >
              <BookOpen className="h-4 w-4" />
              <span>Writings & Notes</span>
            </button>

            <button
              onClick={() => navigate("/art-zone")}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 text-left"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Creative Art Zone</span>
            </button>
          </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
          <button
            onClick={() => navigate("/home")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all duration-200"
          >
            <Home className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 text-sm font-medium transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full overflow-y-auto">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-blue-700 text-xs font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping"></span>
                Public Social Stream
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              LifeOS Explore
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Discover inspiring visual artworks and community thoughts shared by all users.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Share Thought</span>
            </button>

            <button
              onClick={() => navigate("/add-art")}
              className="flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm shadow-sm hover:bg-slate-50 transition-all duration-200"
            >
              <Palette className="h-4 w-4 text-emerald-600" />
              <span>Upload Art</span>
            </button>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* SEARCH INPUT */}
          <div className="flex items-center gap-3 w-full sm:w-80 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus-within:border-blue-500 focus-within:bg-white transition-all">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search posts, thoughts, or authors..."
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* FILTER PILLS */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === "ALL"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({feed.length})
            </button>

            <button
              onClick={() => setActiveFilter("ART")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === "ART"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🎨 Artworks
            </button>

            <button
              onClick={() => setActiveFilter("POST")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === "POST"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              💡 Thoughts
            </button>
          </div>
        </div>

        {/* FEED STREAM */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Gathering community creations...</p>
          </div>
        ) : filteredFeed.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filteredFeed.map((item) => {
              const itemKey = `${item.itemType}-${item.id}`;
              const isArt = item.itemType === "ART";
              const isOwner = item.username === currentUsername;
              const isCommentsOpen = !!expandedComments[itemKey];
              const isLikedAnimating = !!likeAnimations[itemKey];

              return (
                <article
                  key={itemKey}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* POST TOP BAR: AUTHOR DETAILS */}
                  <div className="p-5 pb-4 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-extrabold shadow-sm"
                        style={{
                          background: isArt
                            ? "linear-gradient(135deg, #10B981, #059669)"
                            : (item.cardColor || "linear-gradient(135deg, #3B82F6, #6366F1)"),
                        }}
                      >
                        {getInitials(item.username)}
                      </div>

                      {/* Name & Timestamp */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {item.authorFullName || item.username}
                          </span>
                          <span className="text-xs text-slate-400">
                            @{item.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Recently"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Post Type Badge */}
                    <div className="flex items-center gap-2">
                      {isArt ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                          <Palette className="h-3 w-3" />
                          <span>Art Gallery</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-semibold">
                          <BookOpen className="h-3 w-3" />
                          <span>Thought Post</span>
                        </span>
                      )}

                      {/* Owner Delete Button */}
                      {isOwner && (
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                          title="Delete Post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* POST CONTENT BODY */}
                  <div className="p-5">
                    {isArt ? (
                      /* ART POST */
                      <div className="space-y-4">
                        {item.imageBase64 && (
                          <div
                            className="relative overflow-hidden rounded-xl bg-slate-900 group cursor-pointer"
                            onDoubleClick={() => handleLike(item)}
                          >
                            <img
                              src={`data:image/jpeg;base64,${item.imageBase64}`}
                              alt={item.title || "Artwork"}
                              className="w-full max-h-[520px] object-contain mx-auto transition-transform duration-500 group-hover:scale-101"
                            />
                            {/* Like Animation on double tap */}
                            {isLikedAnimating && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] animate-ping">
                                <Heart className="h-20 w-20 fill-rose-500 text-rose-500" />
                              </div>
                            )}
                          </div>
                        )}
                        {item.content && (
                          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                            {item.content}
                          </p>
                        )}
                      </div>
                    ) : (
                      /* THOUGHT POST */
                      <div
                        className="rounded-xl p-5 bg-gradient-to-r from-slate-50 to-white border-l-4"
                        style={{ borderLeftColor: item.cardColor || "#2563EB" }}
                      >
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                          {item.content}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ACTION BAR: LIKE & COMMENT TOGGLE */}
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLike(item)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          item.liked
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "text-slate-600 hover:bg-slate-100 border border-transparent"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 transition-transform ${
                            item.liked ? "fill-rose-500 text-rose-500 scale-110" : ""
                          }`}
                        />
                        <span>{item.likesCount || 0} Likes</span>
                      </button>

                      {/* Comment Button */}
                      <button
                        onClick={() => toggleCommentsView(itemKey)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          isCommentsOpen
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "text-slate-600 hover:bg-slate-100 border border-transparent"
                        }`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{item.commentsCount || 0} Comments</span>
                      </button>
                    </div>

                    <span className="text-xs text-slate-400">
                      Click to interact
                    </span>
                  </div>

                  {/* EXPANDABLE COMMENTS SECTION */}
                  {isCommentsOpen && (
                    <div className="border-t border-slate-100 p-5 bg-slate-50/80 space-y-4 animate-in fade-in duration-200">
                      {/* Comments List */}
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {(item.comments || []).length === 0 ? (
                          <div className="text-center py-4 text-xs text-slate-400 italic">
                            No comments yet. Be the first to share your thoughts!
                          </div>
                        ) : (
                          item.comments.map((c) => (
                            <div
                              key={c.id || Math.random()}
                              className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-800 text-xs">
                                  {c.username}
                                </span>
                                {c.createdAt && (
                                  <span className="text-[10px] text-slate-400">
                                    {new Date(c.createdAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-700 text-xs sm:text-sm leading-normal">
                                {c.text}
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Comment Input Form */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleCommentSubmit(item);
                        }}
                        className="flex items-center gap-2 pt-2 border-t border-slate-200/70"
                      >
                        <input
                          type="text"
                          placeholder="Write a supportive comment..."
                          className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                          value={commentInputs[itemKey] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [itemKey]: e.target.value,
                            }))
                          }
                          disabled={commentSubmitting[itemKey]}
                        />
                        <button
                          type="submit"
                          disabled={commentSubmitting[itemKey] || !(commentInputs[itemKey] || "").trim()}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Post</span>
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 text-3xl">
              ✨
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              No Content Found
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              {searchTerm
                ? "No posts matched your search keywords. Try adjusting your query."
                : "No posts found for this filter. Be the first to share an inspiring thought or artwork!"}
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm transition"
            >
              Share a Thought Now
            </button>
          </div>
        )}
      </main>

      {/* CREATE THOUGHT POST MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Share a Community Thought
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your post will appear on both Explore and your Writings space.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
              {createError && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 rounded-xl">
                  {createError}
                </div>
              )}

              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Post Title
                </label>
                <input
                  type="text"
                  placeholder="Give your thought a compelling title..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  value={newPostForm.title}
                  onChange={(e) =>
                    setNewPostForm({ ...newPostForm, title: e.target.value })
                  }
                />
              </div>

              {/* Accent Color Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Accent Color
                </label>
                <div className="flex gap-2.5 pt-1">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() =>
                        setNewPostForm({ ...newPostForm, cardColor: color })
                      }
                      className={`w-7 h-7 rounded-full cursor-pointer transition-all border-2 ${
                        newPostForm.cardColor === color
                          ? "border-slate-800 scale-110 shadow-sm"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Thought Content Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Your Thoughts & Reflections
                </label>
                <textarea
                  rows="5"
                  placeholder="Pour your reflections, stories, or creative insights here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                  value={newPostForm.content}
                  onChange={(e) =>
                    setNewPostForm({ ...newPostForm, content: e.target.value })
                  }
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition"
                >
                  {createSubmitting ? "Posting..." : "Publish Thought"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Community Post?"
        description="Are you sure you want to delete this post? It will be permanently removed from Explore and your collection."
      />
    </div>
  );
}
