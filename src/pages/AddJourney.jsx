import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import imageCompression from "browser-image-compression";
import "../styles/AddJourney.css";

export default function AddJourney() {
  const navigate = useNavigate();

  const [placeName, setPlaceName] = useState("");
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 🔥 Drag & Drop
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await processImages(files);
  };

  const handleDragOver = (e) => e.preventDefault();

  // 📸 Input Upload
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    await processImages(files);
  };

  // 🧠 Compress + Store
  const processImages = async (files) => {
    const compressedImages = [];
    const previews = [];

    for (let file of files) {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });

      compressedImages.push(compressed);
      previews.push(URL.createObjectURL(compressed));
    }

    setImages((prev) => [...prev, ...compressedImages]);
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  // ❌ Remove
  const removeImage = (index) => {
    const newImgs = [...images];
    const newPrev = [...previewUrls];

    newImgs.splice(index, 1);
    newPrev.splice(index, 1);

    setImages(newImgs);
    setPreviewUrls(newPrev);
  };

  // 🔄 Reorder
  const moveImage = (index, direction) => {
    const newImgs = [...images];
    const newPrev = [...previewUrls];

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;

    [newImgs[index], newImgs[newIndex]] = [newImgs[newIndex], newImgs[index]];
    [newPrev[index], newPrev[newIndex]] = [newPrev[newIndex], newPrev[index]];

    setImages(newImgs);
    setPreviewUrls(newPrev);
  };

  // 🚀 Submit with progress
  const handleSubmit = async () => {
    if (!placeName || !caption || images.length === 0) {
      alert("Please fill all fields and add images");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("placeName", placeName);
      formData.append("caption", caption);

      images.forEach((img) => formData.append("images", img));

      await API.post("/travel/post", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      });

      alert("Uploaded successfully!");
      navigate("/home");

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="d-flex justify-content-between mb-3">
        <h4 style={{ color: "#C9996B" }}>Add Journey</h4>
        <button className="btn btn-secondary" onClick={() => navigate("/home")}>
          Back
        </button>
      </div>

      <div className="card p-4 shadow-sm">

        {/* Inputs */}
        <input
          className="form-control mb-3"
          placeholder="Place Name"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
        />

        <textarea
          className="form-control mb-3"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* 🔥 Drag Drop Zone */}
        <div
          className="drop-zone mb-3"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          Drag & Drop Images OR Click Below
          <input type="file" multiple onChange={handleImageChange} />
        </div>

        {/* 🖼️ Preview */}
        <div className="image-grid">
          {previewUrls.map((url, index) => (
            <div key={index} className="image-card">

              <img src={url} alt="" />

              <div className="controls">
                <button onClick={() => moveImage(index, -1)}>⬅</button>
                <button onClick={() => moveImage(index, 1)}>➡</button>
                <button onClick={() => removeImage(index)}>❌</button>
              </div>

            </div>
          ))}
        </div>

        {/* 📊 Progress */}
        {loading && (
          <div className="progress mt-3">
            <div
              className="progress-bar"
              style={{ width: `${progress}%`, background: "#C9996B" }}
            >
              {progress}%
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          className="btn mt-3"
          style={{ backgroundColor: "#C9996B", color: "white" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add Journey"}
        </button>

      </div>
    </div>
  );
}