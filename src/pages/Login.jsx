import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";

const Login = () => {
  const [data, setData] = useState({ username: "", password: "" });

  const handleLogin = async () => {
    const res = await axios.post("http://localhost:4550/auth/login", data);
    localStorage.setItem("token", res.data.token);
    window.location.href = "/home";
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <input placeholder="Username"
          onChange={(e) => setData({...data, username: e.target.value.toLowerCase()})} />

        <input type="password" placeholder="Password"
          onChange={(e) => setData({...data, password: e.target.value})} />

        <button onClick={handleLogin}>Login</button>

        <div className="switch-link" onClick={() => window.location.href="/register"}>
          Create Account
        </div>
      </div>
    </div>
  );
};

export default Login;