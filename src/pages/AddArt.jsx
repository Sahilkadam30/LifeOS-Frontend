import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function AddArt() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);

    setFiles(fileArray);

    const previewArray = fileArray.map(file =>
      URL.createObjectURL(file)
    );

    setPreviews(previewArray);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const generateCaption = () => {
    const suggestions = [
      "Lost in creativity 🎨",
      "Art speaks where words fail ✨",
      "A piece of my imagination 💭",
      "Colors telling my story 🌈",
      "Created with passion ❤️",
    ];

    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    setCaption(random);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please select at least one file");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("caption", caption);

        await API.post("/art/post", formData, {
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          },
        });
      }

      setSuccess(true);

      setTimeout(() => navigate("/art-zone"), 2000);

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#C9996B]">

      {success && (
        <div className="fixed top-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          🎉 Uploaded Successfully!
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow w-[420px]">

        <h2 className="text-2xl font-semibold mb-4 text-center">
          Upload Your Art
        </h2>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed p-6 text-center rounded-lg cursor-pointer"
        >
          Drag & Drop images here  
          <br /> or select below
        </div>

        <input
          type="file"
          multiple
          disabled={loading}
          onChange={(e) => handleFiles(e.target.files)}
          className="mt-3 w-full"
        />

        <div className="grid grid-cols-3 gap-2 mt-4">
          {previews.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="preview"
              className="w-full h-24 object-cover rounded"
            />
          ))}
        </div>

        <textarea
          placeholder="Write your caption..."
          className="w-full mt-4 border p-3 rounded-lg h-24"
          value={caption}
          disabled={loading}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button
          onClick={generateCaption}
          disabled={loading}
          className="mt-2 text-blue-600 text-sm"
        >
          🤖 Generate Caption
        </button>

        {loading && (
          <div className="w-full bg-gray-200 rounded mt-3">
            <div
              className="bg-green-500 text-xs text-white text-center p-1 rounded"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-4 py-3 mt-4 w-full rounded-lg"
        >
          {loading ? "Uploading..." : "Post"}
        </button>

        <button
          onClick={() => navigate("/art-zone")}
          disabled={loading}
          className="mt-3 w-full border py-2 rounded-lg"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}