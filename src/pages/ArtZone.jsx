import { useEffect, useState } from "react";
import API from "../api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

const pastelColors = [
  "bg-[#FFF6D8]", // pastel yellow
  "bg-[#DDF6E4]", // mint green
  "bg-[#EEE6FF]", // lavender
  "bg-[#E4F0FF]", // soft blue
  "bg-[#FFE7EC]", // blush pink
];

export default function ArtZone() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [likedAnimation, setLikedAnimation] = useState({});

  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

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
    try {
      await API.delete(`/art/post/${id}`);

      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#F8F6F4] px-6 md:px-12 py-10 font-['Inter'] text-[#1F1F1F]">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-12">

        <div>
          <h1 className="text-5xl font-semibold font-['Playfair_Display'] text-[#2B2B2B]">
            Art Journal
          </h1>

          <p className="text-[#777777] mt-2 text-lg">
            A calm creative space for your visual stories.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-[#ECECEC]">
            <p className="text-sm text-[#777]">Logged in as</p>
            <p className="font-semibold">{user}</p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-[#6C4DFF] hover:scale-105 transition-all duration-300 text-white px-6 py-3 rounded-2xl shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      {/* POSTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">

        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`${
              pastelColors[index % pastelColors.length]
            } rounded-[32px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1`}
          >

            {/* IMAGE */}
            <div
              className="relative overflow-hidden rounded-[24px]"
              onDoubleClick={() => handleDoubleTap(post.id)}
            >
              <img
                src={`data:image/jpeg;base64,${post.image}`}
                alt={post.caption}
                className="w-full h-[350px] object-cover rounded-[24px]"
              />

              {likedAnimation[post.id] && (
                <div className="absolute inset-0 flex items-center justify-center text-7xl animate-ping">
                  ❤️
                </div>
              )}

              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-[#555] shadow-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* CONTENT */}
            <div className="mt-5">

              <p className="text-lg leading-relaxed text-[#2D2D2D] font-medium">
                {post.caption}
              </p>

              <div className="flex items-center justify-between mt-5">

                <button
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-2 text-[#6C4DFF] font-semibold hover:scale-105 transition"
                >
                  ❤️ {post.likes}
                </button>

                {post.username === user && (
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-sm text-[#888] hover:text-red-500 transition"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* COMMENTS */}
              <div className="mt-6 space-y-3">

                {(comments[post.id] || []).map((c) => (
                  <div
                    key={c.id}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3"
                  >
                    <p className="text-sm text-[#444]">
                      <span className="font-semibold text-[#222]">
                        {c.username}
                      </span>{" "}
                      {c.text}
                    </p>
                  </div>
                ))}

                {/* COMMENT INPUT */}
                <div className="flex items-center bg-white rounded-2xl overflow-hidden shadow-sm mt-4">

                  <input
                    type="text"
                    placeholder="Write a thoughtful comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      setCommentText({
                        ...commentText,
                        [post.id]: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-3 bg-transparent outline-none text-sm"
                  />

                  <button
                    onClick={() => addComment(post.id)}
                    className="bg-[#6C4DFF] text-white px-5 py-3 hover:opacity-90 transition"
                  >
                    Post
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FLOATING BUTTON */}
      <button
        onClick={() => navigate("/add-art")}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-[#6C4DFF] text-white text-3xl shadow-[0_10px_30px_rgba(108,77,255,0.35)] hover:scale-110 transition-all duration-300"
      >
        +
      </button>
    </div>
  );
}