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

  // 📍 Auto fill from map
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

      alert("Visited Place Added");

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="row">
        {/* FORM */}
        <div className="col-md-4">
          <div className="card p-4 shadow-sm">
            <h3>Add Visited Place</h3>

            <input
              className="form-control my-2"
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
              className="form-control my-2"
              placeholder="Type"
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
              className="form-control my-2"
              onChange={(e) =>
                setForm({
                  ...form,
                  visitedOn: e.target.value,
                })
              }
            />

            <input
              className="form-control my-2"
              placeholder="City"
              value={form.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  city: e.target.value,
                })
              }
            />

            <input
              className="form-control my-2"
              placeholder="Latitude"
              value={form.latitude}
              readOnly
            />

            <input
              className="form-control my-2"
              placeholder="Longitude"
              value={form.longitude}
              readOnly
            />

            <button
              className="btn btn-primary mt-3"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>

        {/* MAP */}
        <div className="col-md-8">
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