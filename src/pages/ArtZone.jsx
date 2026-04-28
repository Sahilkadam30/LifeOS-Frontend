import { useEffect, useState } from "react";
import API, { getAuthHeaders } from "../api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function ArtZone() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

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

  const fetchPosts = async () => {
    try {
      const res = await API.get("/api/art/posts", {
        headers: getAuthHeaders(),
      });
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const likePost = async (id) => {
    try {
      await API.post(`/api/art/like/${id}`, {}, {
        headers: getAuthHeaders(),
      });
      setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#C9996B] text-black p-5">
      <h1 className="text-3xl font-bold mb-5">{user}'s Art Zone</h1>

      <div className="grid gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded-xl shadow">

            <img
              src={`data:image/jpeg;base64,${post.image}`}
              className="rounded-lg mb-3"
              alt={post.caption}
            />

            <p>{post.caption}</p>

            <div className="flex justify-between mt-2">
              <span>{new Date(post.createdAt).toLocaleString()}</span>

              <button
                onClick={() => likePost(post.id)}
                className="text-red-500"
              >
                ❤️ {post.likes}
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 bg-black text-white w-14 h-14 rounded-full text-2xl"
        onClick={() => navigate("/add-art")}
      >
        +
      </button>
    </div>
  );
}
