import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function AddWishlist() {

  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await API.post("/wishlist", form);

      navigate("/dashboard");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F4] px-6 py-10 font-['Inter']">

      <div className="max-w-3xl mx-auto bg-white rounded-[32px] p-10 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">

        <h1 className="text-5xl font-['Playfair_Display'] text-[#222] mb-2">
          Wishlist Destination
        </h1>

        <p className="text-[#777] mb-10">
          Places waiting to become memories.
        </p>

        <div className="space-y-5">

          <input
            className="w-full bg-[#F8F6F4] border border-[#ECECEC] rounded-2xl px-5 py-4 outline-none focus:border-[#6C4DFF]"
            placeholder="Place Name"
            onChange={(e) =>
              setForm({
                ...form,
                placeName: e.target.value,
              })
            }
          />

          <input
            type="date"
            className="w-full bg-[#F8F6F4] border border-[#ECECEC] rounded-2xl px-5 py-4 outline-none focus:border-[#6C4DFF]"
            onChange={(e) =>
              setForm({
                ...form,
                planDate: e.target.value,
              })
            }
          />

          <input
            className="w-full bg-[#F8F6F4] border border-[#ECECEC] rounded-2xl px-5 py-4 outline-none focus:border-[#6C4DFF]"
            placeholder="City"
            onChange={(e) =>
              setForm({
                ...form,
                city: e.target.value,
              })
            }
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              className="bg-[#F8F6F4] border border-[#ECECEC] rounded-2xl px-5 py-4"
              placeholder="Latitude"
              onChange={(e) =>
                setForm({
                  ...form,
                  latitude: parseFloat(e.target.value),
                })
              }
            />

            <input
              className="bg-[#F8F6F4] border border-[#ECECEC] rounded-2xl px-5 py-4"
              placeholder="Longitude"
              onChange={(e) =>
                setForm({
                  ...form,
                  longitude: parseFloat(e.target.value),
                })
              }
            />

          </div>

          <button
            className="w-full bg-[#6C4DFF] hover:scale-[1.01] transition-all duration-300 text-white py-4 rounded-2xl text-lg shadow-lg"
            onClick={handleSubmit}
          >
            Save Wishlist
          </button>

        </div>
      </div>
    </div>
  );
}