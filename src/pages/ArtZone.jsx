import { useEffect, useState } from "react";
import API from "../api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../components/store/slice/auth.slice";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { 
  Zap, 
  Image as ImageIcon, 
  Plus, 
  Home, 
  LogOut, 
  Heart, 
  MessageSquare, 
  Trash2, 
  Calendar,
  User
} from "lucide-react";

let stompClient = null;

export default function ArtZone() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [likedAnimation, setLikedAnimation] = useState({});

  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ================= FETCH POSTS =================
  const fetchPosts = async () => {
    try {
      const res = await API.get("/art/posts");
      setPosts(res.data);
      res.data.forEach((post) => fetchComments(post.id));
      connectWebSocket(res.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  // ================= FETCH COMMENTS =================
  const fetchComments = async (postId) => {
    try {
      const res = await API.get(`/art/comments/${postId}`);
      setComments((prev) => ({
        ...prev,
        [postId]: res.data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= WEBSOCKET =================
  const connectWebSocket = (postsList) => {
    if (stompClient) return;

    stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:4550/ws"),
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      console.log("✅ WebSocket Connected");

      postsList.forEach((post) => {
        stompClient.subscribe(`/topic/comments/${post.id}`, (msg) => {
          const newComment = JSON.parse(msg.body);

          setComments((prev) => ({
            ...prev,
            [post.id]: [...(prev[post.id] || []), newComment],
          }));
        });
      });
    };

    stompClient.activate();
  };

  // ================= INIT =================
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(currentUser?.username || decoded.sub);
      fetchPosts();
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login");
    }
  }, [token]);

  // ================= ADD COMMENT =================
  const addComment = (postId) => {
    if (!stompClient || !stompClient.connected) return;

    const text = commentText[postId];
    if (!text) return;

    stompClient.publish({
      destination: "/app/comment",
      body: JSON.stringify({
        postId,
        text,
        username: user,
      }),
    });

    setCommentText((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  // ================= LIKE =================
  const likePost = async (id) => {
    try {
      const res = await API.post(`/art/like/${id}`);
      setPosts(
        posts.map((p) =>
          p.id === id ? { ...p, likes: res.data } : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DOUBLE TAP =================
  const handleDoubleTap = async (id) => {
    await likePost(id);

    setLikedAnimation((prev) => ({
      ...prev,
      [id]: true,
    }));

    setTimeout(() => {
      setLikedAnimation((prev) => ({
        ...prev,
        [id]: false,
      }));
    }, 600);
  };

  // ================= DELETE =================
  const deletePost = async (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await API.delete(`/art/post/${id}`);
        setPosts(posts.filter((p) => p.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-['Inter',_sans-serif] flex">
      {/* ART SIDEBAR */}
      <div style={{
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
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div>
          {/* LOGO */}
          <div 
            onClick={() => navigate("/art-zone")}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, paddingLeft: 8, cursor: "pointer" }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg,#2563EB,#00C853)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ImageIcon style={{ color: "#fff", size: 20 }} />
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0, lineHeight: 1.2 }}>Art Journal</p>
              <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>Creative Canvas</p>
            </div>
          </div>

          {/* SECTION LABEL */}
          <p style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: 12, marginBottom: 8 }}>
            Navigation
          </p>

          {/* NAVIGATION ITEMS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              onClick={() => navigate("/art-zone")}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                background: "rgba(0,200,83,0.15)",
                borderLeft: "3px solid #00C853",
                color: "#00C853",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <ImageIcon size={16} />
              <span>Gallery Grid</span>
            </div>

            <div
              onClick={() => navigate("/add-art")}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                background: "transparent",
                borderLeft: "3px solid transparent",
                color: "#94A3B8",
                fontWeight: 400,
                fontSize: 14,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
            >
              <Plus size={16} />
              <span>Upload Art</span>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={() => navigate("/home")}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer",
              background: "transparent", color: "#94A3B8", fontSize: 14, textAlign: "left",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
          >
            <Home size={16} />
            <span>Back to Home</span>
          </button>

          <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "8px 0" }} />

          <button
            onClick={handleLogout}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "transparent", color: "#EF4444", fontSize: 14, textAlign: "left",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight leading-none mb-2">
              Art Gallery
            </h1>
            <p className="text-[#64748B] text-[15px]">
              A clean creative space for storing and reviewing your visual stories.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 border border-[#E2E8F0] rounded-[10px] shadow-sm flex items-center gap-2">
              <User size={15} className="text-[#64748B]" />
              <div>
                <span className="text-[10px] text-[#64748B] block font-semibold uppercase tracking-wider leading-none mb-0.5">Author</span>
                <span className="text-[13px] font-bold text-[#1E293B] leading-none">{user}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/add-art")}
              className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium px-5 py-3 rounded-[10px] text-[15px] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Plus size={16} />
              <span>Upload Artwork</span>
            </button>
          </div>
        </div>

        {/* POSTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* IMAGE CONTAINER */}
              <div>
                <div
                  className="relative overflow-hidden rounded-[10px] group cursor-pointer"
                  onDoubleClick={() => handleDoubleTap(post.id)}
                >
                  <img
                    src={`data:image/jpeg;base64,${post.image}`}
                    alt={post.caption}
                    className="w-full h-[320px] object-cover rounded-[10px] transition-transform duration-500 group-hover:scale-102"
                  />

                  {likedAnimation[post.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px] text-white animate-ping">
                      <Heart size={80} className="fill-red-500 text-red-500" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-[#071B3A]/85 backdrop-blur-md px-3 py-1 rounded-[6px] text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-sm">
                    <Calendar size={12} />
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>

                {/* CAPTION */}
                <div className="mt-4">
                  <p className="text-[15px] font-medium text-[#1E293B] leading-relaxed">
                    {post.caption}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-5">
                <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-4 mb-4">
                  <button
                    onClick={() => likePost(post.id)}
                    className="flex items-center gap-1.5 text-[#2563EB] hover:text-[#1D4ED8] font-semibold text-[13px] transition"
                  >
                    <Heart size={16} className="fill-[#2563EB]/10" />
                    <span>{post.likes} Likes</span>
                  </button>

                  {post.username === user && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="flex items-center gap-1 text-[13px] text-[#94A3B8] hover:text-[#EF4444] transition-colors font-medium"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                {/* COMMENTS LIST */}
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {(comments[post.id] || []).map((c) => (
                    <div
                      key={c.id}
                      className="bg-[#F8FAFC] border border-[#E2E8F0]/30 rounded-[8px] px-3.5 py-2"
                    >
                      <p className="text-[13px] text-[#334155] leading-normal">
                        <span className="font-bold text-[#1E293B] mr-1">
                          {c.username}
                        </span>
                        {c.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* COMMENT INPUT */}
                <div className="flex items-center border border-[#E2E8F0] rounded-[10px] overflow-hidden mt-4 bg-[#F8FAFC]">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      setCommentText({
                        ...commentText,
                        [post.id]: e.target.value,
                      })
                    }
                    className="flex-1 px-3.5 py-2 bg-transparent outline-none text-[13px] text-[#1E293B]"
                  />
                  <button
                    onClick={() => addComment(post.id)}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 text-[13px] font-semibold transition"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}