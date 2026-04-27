import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function ArtZone() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const decoded = jwtDecode(token);
    setUser(decoded.sub);

    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:4550/api/art/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(res.data);
  };

  const likePost = async (id) => {
    await axios.post(`http://localhost:4550/api/art/like/${id}`);
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
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
        onClick={() => window.location.href = "/add-art"}
      >
        +
      </button>
    </div>
  );
}