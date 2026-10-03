import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud, Image as ImageIcon, Globe, Lock } from "lucide-react";

export default function AddArt() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    setFiles(fileArray);
    const previewArray = fileArray.map(file => URL.createObjectURL(file));
    setPreviews(previewArray);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
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
        formData.append("isPublic", isPublic);

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
    <div className="min-h-screen bg-[#F5F7FA] font-['Inter',_sans-serif] flex items-center justify-center p-6 relative">
      {success && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-[#16A34A] text-white px-6 py-3 rounded-[10px] shadow-lg font-semibold z-50 flex items-center gap-2">
          <span>🎉 Artwork uploaded successfully!</span>
        </div>
      )}

      <div className="bg-white border border-[#E2E8F0] p-8 rounded-[16px] shadow-sm w-full max-w-[480px]">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/art-zone")}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#1E293B] text-[14px] font-medium mb-6 transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Gallery</span>
        </button>

        <h2 className="text-[24px] font-bold text-[#1E293B] mb-1.5">
          Upload Your Art
        </h2>
        <p className="text-[#64748B] text-[14px] mb-6">
          Publish your latest visual drafts and creative notes.
        </p>

        {/* Drag & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("art-file-input").click()}
          className="border-2 border-dashed border-[#E2E8F0] hover:border-[#2563EB] bg-[#F8FAFC] hover:bg-[#F1F5F9] p-8 text-center rounded-[12px] cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center gap-2.5"
        >
          <UploadCloud size={32} className="text-[#94A3B8]" />
          <div>
            <p className="text-[14px] font-semibold text-[#1E293B]">Drag & Drop your images here</p>
            <p className="text-[12px] text-[#64748B] mt-0.5">or click to search files</p>
          </div>
        </div>

        <input
          id="art-file-input"
          type="file"
          multiple
          disabled={loading}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        {/* Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            {previews.map((img, i) => (
              <div key={i} className="relative rounded-[8px] overflow-hidden border border-[#E2E8F0]">
                <img
                  src={img}
                  alt="preview"
                  className="w-full h-20 object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Caption */}
        <div className="mt-5 space-y-1.5">
          <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
            Caption Description
          </label>
          <textarea
            placeholder="Describe your artwork or process..."
            className="w-full border border-[#E2E8F0] rounded-[10px] p-3 h-24 outline-none text-[14px] text-[#1E293B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all resize-none"
            value={caption}
            disabled={loading}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        {/* Public / Private Toggle */}
        <div className="mt-5">
          <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block mb-2">
            Visibility
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsPublic(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] border text-[13px] font-semibold transition-all duration-200 ${
                !isPublic
                  ? "bg-[#1E293B] border-[#1E293B] text-white shadow-sm"
                  : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#94A3B8]"
              }`}
            >
              <Lock size={14} />
              Private
            </button>
            <button
              type="button"
              onClick={() => setIsPublic(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] border text-[13px] font-semibold transition-all duration-200 ${
                isPublic
                  ? "bg-[#2563EB] border-[#2563EB] text-white shadow-sm"
                  : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#94A3B8]"
              }`}
            >
              <Globe size={14} />
              Public
            </button>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2">
            {isPublic
              ? "🌐 This artwork will appear on LifeOS Explore for everyone to see."
              : "🔒 This artwork is only visible in your Art Zone."}
          </p>
        </div>

        {/* Progress bar */}
        {loading && (
          <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full mt-5 overflow-hidden">
            <div
              className="bg-[#16A34A] h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Action button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium px-5 py-3 rounded-[10px] text-[15px] shadow-sm hover:shadow transition-all duration-200 w-full mt-6 flex items-center justify-center gap-2"
        >
          <ImageIcon size={16} />
          <span>{loading ? `Uploading (${progress}%)` : "Post Art Piece"}</span>
        </button>
      </div>
    </div>
  );
}