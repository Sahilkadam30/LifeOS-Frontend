import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/Dashboard.css";

import { useDispatch } from "react-redux";
import { logout } from "../components/store/slice/auth.slice";

export default function Dashboard() {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);
    } catch (err) {
      console.log(err);
      alert("Unauthorized! Please login again.");
      dispatch(logout());
    }
  };

  return (
    <div className="dashboard">
      <h1>Welcome to LifeOS Dashboard 🚀</h1>

      <div className="grid">

        <div className="card" onClick={() => navigate("/art-zone")}>
          <h2>🎨 Art</h2>
          <p>{data.art}</p>
        </div>

        <div className="card" onClick={() => navigate("/travel")}>
          <h2>🌍 Travel</h2>
          <p>{data.travel}</p>
        </div>

        <div className="card" onClick={() => navigate("/travelfeed")}>
          <h2>💪 Travelfeed</h2>
          <p>{data.gym}</p>
        </div>

        <div className="card" onClick={() => navigate("/ai")}>
          <h2>🤖 AI</h2>
          <p>{data.ai}</p>
        </div>

        <div className="card" onClick={() => navigate("/story")}>
          <h2>📖 Story</h2>
          <p>{data.story}</p>
        </div>

      </div>
    </div>
  );
}