import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api"

export default function EditVisited() {
  const { state } = useLocation();

  const navigate = useNavigate();

  const [form, setForm] = useState(state);

  const handleUpdate = async () => {
    try {
      await API.put(`/visited/${form.id}`, form);

      alert("Updated Successfully");

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container p-4">
      <div className="card p-4">
        <h3>Edit Place</h3>

        <input
          className="form-control my-2"
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
          value={form.city}
          onChange={(e) =>
            setForm({
              ...form,
              city: e.target.value,
            })
          }
        />

        <button
          className="btn btn-success"
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </div>
  );
}