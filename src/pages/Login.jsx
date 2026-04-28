import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Login = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!data.username || !data.password) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <input placeholder="Username"
          disabled={loading}
          onChange={(e) => setData({...data, username: e.target.value.toLowerCase()})} />

        <input type="password" placeholder="Password"
          disabled={loading}
          onChange={(e) => setData({...data, password: e.target.value})} />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="switch-link" onClick={() => !loading && navigate("/register")}>
          Create Account
        </div>
      </div>
    </div>
  );
};

export default Login;
