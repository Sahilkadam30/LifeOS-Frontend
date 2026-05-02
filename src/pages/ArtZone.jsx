import { useEffect, useState } from "react";
import API from "../api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export default function ArtZone() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [likedAnimation, setLikedAnimation] = useState({});

  const navigate = useNavigate();

  // ================= INIT =================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded.sub);
      fetchPosts();
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, []);

  // ================= FETCH POSTS =================
  const fetchPosts = async () => {
    try {
      const res = await API.get("/art/posts"); // ✅ FIXED

      setPosts(res.data);

      res.data.forEach(post => fetchComments(post.id));

      connectWebSocket(res.data);

    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  // ================= FETCH COMMENTS =================
  const fetchComments = async (postId) => {
    try {
      const res = await API.get(`/art/comments/${postId}`); // ✅ FIXED

      setComments(prev => ({
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

      postsList.forEach(post => {
        stompClient.subscribe(`/topic/comments/${post.id}`, (msg) => {
          const newComment = JSON.parse(msg.body);

          setComments(prev => ({
            ...prev,
            [post.id]: [...(prev[post.id] || []), newComment],
          }));
        });
      });
    };

    stompClient.activate();
  };

  // ================= ADD COMMENT =================
  const addComment = (postId) => {
    if (!stompClient || !stompClient.connected) return;

    const text = commentText[postId];
    if (!text) return;

    stompClient.publish({
      destination: "/app/comment",
      body: JSON.stringify({ postId, text, username: user }),
    });

    setCommentText(prev => ({ ...prev, [postId]: "" }));
  };

  // ================= LIKE =================
  const likePost = async (id) => {
    try {
      const res = await API.post(`/art/like/${id}`); // ✅ FIXED

      setPosts(posts.map(p =>
        p.id === id ? { ...p, likes: res.data } : p
      ));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DOUBLE TAP =================
  const handleDoubleTap = async (id) => {
    await likePost(id);

    setLikedAnimation(prev => ({ ...prev, [id]: true }));

    setTimeout(() => {
      setLikedAnimation(prev => ({ ...prev, [id]: false }));
    }, 600);
  };

  // ================= DELETE =================
  const deletePost = async (id) => {
    try {
      await API.delete(`/art/post/${id}`); // ✅ FIXED

      setPosts(posts.filter(p => p.id !== id));
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
    <div className="min-h-screen bg-[#C9996B] text-black p-5">

      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">{user}'s Art Zone</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {posts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded-xl shadow">

            <div
              className="relative"
              onDoubleClick={() => handleDoubleTap(post.id)}
            >
              <img
                src={`data:image/jpeg;base64,${post.image}`}
                className="rounded-lg w-full"
                alt={post.caption}
              />

              {likedAnimation[post.id] && (
                <div className="absolute inset-0 flex items-center justify-center text-6xl animate-ping">
                  ❤️
                </div>
              )}

              <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="mt-2 font-medium">{post.caption}</p>

            <div className="flex justify-between mt-2">
              <button
                onClick={() => likePost(post.id)}
                className="text-red-500 font-semibold"
              >
                ❤️ {post.likes}
              </button>

              {post.username === user && (
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              )}
            </div>

            <div className="mt-3">
              {(comments[post.id] || []).map(c => (
                <p key={c.id} className="text-sm">
                  <b>{c.username}</b>: {c.text}
                </p>
              ))}

              <div className="flex mt-2">
                <input
                  type="text"
                  placeholder="Add comment..."
                  value={commentText[post.id] || ""}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [post.id]: e.target.value,
                    })
                  }
                  className="border p-1 flex-1 rounded-l"
                />

                <button
                  onClick={() => addComment(post.id)}
                  className="bg-blue-500 text-white px-3 rounded-r"
                >
                  Post
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      <button
        className="fixed bottom-6 right-6 bg-black text-white w-14 h-14 rounded-full text-2xl"
        onClick={() => navigate("/add-art")}
      >
        +
      </button>
    </div>
  );
}