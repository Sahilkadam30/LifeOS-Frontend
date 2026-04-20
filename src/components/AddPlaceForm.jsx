import { useState } from "react";
import axios from "axios";

export default function AddPlaceForm() {
  const [form, setForm] = useState({
    placeName: "",
    category: "",
    description: "",
    visitDate: ""
  });

  const handleSubmit = async () => {
    await axios.post("http://localhost:4550/api/travel", form);
    alert("Saved!");
  };

  return (
    <div className="card">
      <h2 className="font-semibold mb-4 text-lg">📍 Add Visited Place</h2>

      <input className="input mb-3" placeholder="Enter place name" />
      <input type="date" className="input mb-3" />
      <input className="input mb-3" placeholder="Category" />

      <textarea
        className="input mb-3 h-24 resize-none"
        placeholder="Write your story..."
      />

      <button onClick={() => handleSubmit()} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
        Save Place
      </button>
    </div>
  );
}