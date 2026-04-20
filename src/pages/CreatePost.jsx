import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await API.post("/posts", { content });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Write Your Thought</h2>

        <textarea
          className="w-full border p-2 rounded h-32"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-black text-white py-2 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
}