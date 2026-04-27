import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";

const Register = () => {

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
      alert("Invalid username format");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await axios.post("http://localhost:4550/auth/register", data);

    alert("Registered Successfully!");
    window.location.href = "/login";
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        <input placeholder="Username"
          onChange={(e) => setData({...data, username: e.target.value.toLowerCase()})} />

        <input placeholder="First Name"
          onChange={(e) => setData({...data, firstName: e.target.value})} />

        <input placeholder="Last Name"
          onChange={(e) => setData({...data, lastName: e.target.value})} />

        <input placeholder="Email"
          onChange={(e) => setData({...data, email: e.target.value})} />

        <input type="password" placeholder="Password"
          onChange={(e) => setData({...data, password: e.target.value})} />

        <input type="password" placeholder="Confirm Password"
          onChange={(e) => setData({...data, confirmPassword: e.target.value})} />

        <button onClick={handleRegister}>Register</button>

        <div className="switch-link" onClick={() => window.location.href="/login"}>
          Already have account?
        </div>
      </div>
    </div>
  );
};

export default Register;