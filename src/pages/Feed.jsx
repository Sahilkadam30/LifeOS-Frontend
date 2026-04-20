import { useEffect, useState } from "react";
import API from "../api";
import PostCard from "../components/PostCard";
import FloatingButton from "../components/FloatingButton";
import PasswordModal from "../components/PasswordModal";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const res = await API.get("/posts");
    setPosts(res.data);
  };

  const handleAddClick = () => {
    setShowPass(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">
      <h1 className="text-3xl font-bold mb-6">🧠 Thoughts Feed</h1>

      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}

      <FloatingButton onClick={handleAddClick} />

      {showPass && (
        <PasswordModal
          onClose={() => setShowPass(false)}
          onSuccess={() => {
            setShowPass(false);
            navigate("/create");
          }}
        />
      )}
    </div>
  );
}