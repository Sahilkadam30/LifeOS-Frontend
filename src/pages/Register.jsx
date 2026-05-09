import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const validateUsername = (username) => {
    const regex = /^[a-z0-9._]{3,20}$/;
    return regex.test(username);
  };

  const handleRegister = async () => {
    if (!validateUsername(data.username)) {
      alert("Invalid username format. Use 3-20 characters (a-z, 0-9, ., _)");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/register", data);
      alert("Registered Successfully!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed. Try a different username or email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        <input placeholder="Username" disabled={loading}
          onChange={(e) => setData({...data, username: e.target.value.toLowerCase()})} />

        <input placeholder="First Name" disabled={loading}
          onChange={(e) => setData({...data, firstName: e.target.value})} />

        <input placeholder="Last Name" disabled={loading}
          onChange={(e) => setData({...data, lastName: e.target.value})} />

        <input placeholder="Email" disabled={loading}
          onChange={(e) => setData({...data, email: e.target.value})} />

        <input type="password" placeholder="Password" disabled={loading}
          onChange={(e) => setData({...data, password: e.target.value})} />

        <input type="password" placeholder="Confirm Password" disabled={loading}
          onChange={(e) => setData({...data, confirmPassword: e.target.value})} />

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="switch-link" onClick={() => !loading && navigate("/login")}>
          Already have account?
        </div>
      </div>
    </div>
  );
};

export default Register;