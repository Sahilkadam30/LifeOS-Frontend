import { useState } from "react";
import axios from "axios";

export default function AddArt() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    await axios.post("http://localhost:4550/api/art/post", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    window.location.href = "/art";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#C9996B]">
      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl mb-4">Upload Art</h2>

        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <textarea
          placeholder="Write caption..."
          className="w-full mt-3 border p-2"
          onChange={e => setCaption(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-2 mt-3 w-full"
        >
          Post
        </button>
      </div>
    </div>
  );
}