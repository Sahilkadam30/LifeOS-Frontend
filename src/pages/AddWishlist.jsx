import { useState } from "react";
import API from "../api"
import { useNavigate } from "react-router-dom";

export default function AddWishlist() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await API.post("/wishlist", form);
      alert("Wishlist added");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container p-4">
      <h3>Add Wishlist</h3>

      <input className="form-control my-2" placeholder="Place Name"
        onChange={e => setForm({...form, placeName: e.target.value})} />

      <input type="date" className="form-control my-2"
        onChange={e => setForm({...form, planDate: e.target.value})} />

      <input className="form-control my-2" placeholder="City"
        onChange={e => setForm({...form, city: e.target.value})} />

      <input className="form-control my-2" placeholder="Latitude"
        onChange={e => setForm({...form, latitude: parseFloat(e.target.value)})} />

      <input className="form-control my-2" placeholder="Longitude"
        onChange={e => setForm({...form, longitude: parseFloat(e.target.value)})} />

      <button className="btn btn-warning mt-3" onClick={handleSubmit}>
        Save
      </button>
    </div>
  );
}