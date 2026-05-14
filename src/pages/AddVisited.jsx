import { useState } from "react";
import API from "../api";
import MapView from "../components/MapView";
import { useNavigate } from "react-router-dom";

export default function AddVisited() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    placeName: "",
    type: "",
    visitedOn: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  const setCoordinates = ({ latitude, longitude }) => {
    setForm({
      ...form,
      latitude,
      longitude,
    });
  };

  const handleSubmit = async () => {
    try {
      await API.post("/visited", form);

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F4] px-6 py-10 font-['Inter']">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* FORM */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">

          <h1 className="text-5xl font-['Playfair_Display'] text-[#222] mb-2">
            Add Visited Place
          </h1>

          <p className="text-[#777] mb-8">
            Save your travel memories beautifully.
          </p>

          <div className="space-y-5">

            <input
              className="w-full bg-[#F8F6F4] border border-[#ECECEC] rounded-2xl px-5 py-4 outline-none focus:border-[#6C4DFF]"
              placeholder="Place Name"
              value={form.placeName}
              onChange={(e) =>
                setForm({
                  ...form,
                  placeName: e.target.value,
                })
              }
            />

            <input
              className="w-full bg-[#F8F6F4] border border-[#ECECEC] rounded-2xl px-5 py-4 outline-none focus:border-[#6C4DFF]"
              placeholder="Type (Fort, Cave, Temple...)"
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value,
                })
              }
            />

            <input
              type="date"
              className="w-full bg-[#F8F6F4] border border-[#ECECEC] rounded-2xl px-5 py-4 outline-none focus:border-[#6C4DFF]"
              onChange={(e) =>
                setForm({
                  ...form,
                  visitedOn: e.target.value,
                })
              }
            />

            <input
              className="w-full bg-[#F8F6F4] border border-[#ECECEC] rounded-2xl px-5 py-4 outline-none focus:border-[#6C4DFF]"
              placeholder="City"
              value={form.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  city: e.target.value,
                })
              }
            />

            <div className="grid grid-cols-2 gap-4">

              <input
                className="bg-[#F1EEFF] rounded-2xl px-5 py-4 text-[#666]"
                placeholder="Latitude"
                value={form.latitude}
                readOnly
              />

              <input
                className="bg-[#F1EEFF] rounded-2xl px-5 py-4 text-[#666]"
                placeholder="Longitude"
                value={form.longitude}
                readOnly
              />

            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#6C4DFF] hover:scale-[1.01] transition-all duration-300 text-white py-4 rounded-2xl text-lg shadow-lg"
            >
              Save Journey
            </button>
          </div>
        </div>

        {/* MAP */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-4">
          <MapView
            visited={[]}
            wishlist={[]}
            setCoordinates={setCoordinates}
          />
        </div>
      </div>
    </div>
  );
}