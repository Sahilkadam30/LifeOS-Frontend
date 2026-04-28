import { useState } from "react";
import API, { getAuthHeaders } from "../api";
import { useNavigate } from "react-router-dom";

export default function AddArt() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    try {
      await API.post("/api/art/post", formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/home");
    } catch (error) {
      console.error("Failed to post art:", error);
      alert(error.response?.data?.message || "Failed to post art. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#C9996B]">
      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl mb-4">Upload Art</h2>

        <input type="file" disabled={loading} onChange={e => setFile(e.target.files[0])} />
        <textarea
          placeholder="Write caption..."
          className="w-full mt-3 border p-2"
          disabled={loading}
          onChange={e => setCaption(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-4 py-2 mt-3 w-full"
        >
          {loading ? "Posting..." : "Post"}
        </button>
        
        <button
          onClick={() => navigate("/home")}
          disabled={loading}
          className="text-black px-4 py-2 mt-2 w-full border"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
