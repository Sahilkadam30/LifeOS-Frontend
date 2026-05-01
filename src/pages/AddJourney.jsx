import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AddJourney() {
  const navigate = useNavigate();

  const [placeName, setPlaceName] = useState("");
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📸 Handle Image Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages((prev) => [...prev, ...files]);

    const newPreviewUrls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  // ❌ Remove Image
  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...previewUrls];

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setImages(updatedImages);
    setPreviewUrls(updatedPreviews);
  };

  // 🚀 Submit Form
  const handleSubmit = async () => {
    if (!placeName || !caption || images.length === 0) {
      alert("Please fill all fields and add at least one image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("placeName", placeName);
      formData.append("caption", caption);

      images.forEach((img) => {
        formData.append("images", img);
      });

      await API.post("/travel/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Journey added successfully!");

      navigate("/travel");

    } catch (err) {
      console.error(err);
      alert("Error uploading journey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ color: "#C9996B" }}>Add Journey</h4>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/travel")}
        >
          Back
        </button>
      </div>

      {/* Form */}
      <div className="card p-3 shadow-sm">

        {/* Place Name */}
        <div className="mb-3">
          <label className="form-label">Place Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter place name"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
          />
        </div>

        {/* Caption */}
        <div className="mb-3">
          <label className="form-label">Caption</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Write your travel story..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label">Upload Images</label>
          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* 🖼️ Image Preview Grid */}
        <div className="row">
          {previewUrls.map((url, index) => (
            <div key={index} className="col-4 mb-3 position-relative">

              <img
                src={url}
                alt="preview"
                className="img-fluid rounded"
                style={{ height: "120px", objectFit: "cover" }}
              />

              {/* Remove Button */}
              <button
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={() => removeImage(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

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