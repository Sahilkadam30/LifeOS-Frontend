import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

/* ── Inline popup styles so nothing bleeds globally ── */
const popupStyles = `
  .reg-popup-overlay {
    position: fixed; inset: 0; z-index: 99999;
    display: flex; align-items: center; justify-content: center;
    background: rgba(15, 30, 60, 0.35);
    backdrop-filter: blur(4px);
    animation: regFadeIn .22s ease;
  }
  .reg-popup {
    background: #fff;
    border-radius: 22px;
    padding: 40px 36px 32px;
    width: min(360px, 90vw);
    text-align: center;
    box-shadow: 0 24px 60px rgba(30,80,140,.18), 0 2px 8px rgba(30,80,140,.08);
    animation: regPopIn .32s cubic-bezier(.2,.9,.2,1);
  }
  .reg-popup-icon {
    width: 68px; height: 68px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; margin: 0 auto 18px;
  }
  .reg-popup-icon.success { background: linear-gradient(135deg,#2d9cf4,#36d69a); }
  .reg-popup-icon.error   { background: linear-gradient(135deg,#f43f5e,#fb923c); }
  .reg-popup h3 {
    font-size: 1.25rem; font-weight: 800; color: #17233f;
    margin-bottom: 8px; letter-spacing: -.03em;
  }
  .reg-popup p {
    font-size: 0.9rem; color: #58708c; line-height: 1.55; margin-bottom: 24px;
  }
  .reg-popup-btn {
    display: inline-block; padding: 11px 32px;
    border-radius: 12px; border: none; cursor: pointer;
    font-size: 0.95rem; font-weight: 700; font-family: inherit;
    color: #fff; transition: transform .15s, box-shadow .15s;
  }
  .reg-popup-btn.success {
    background: linear-gradient(135deg,#2d9cf4,#36d69a);
    box-shadow: 0 6px 18px rgba(45,156,244,.3);
  }
  .reg-popup-btn.error {
    background: linear-gradient(135deg,#f43f5e,#fb923c);
    box-shadow: 0 6px 18px rgba(244,63,94,.3);
  }
  .reg-popup-btn:hover { transform: translateY(-2px); }
  @keyframes regFadeIn { from { opacity:0 } to { opacity:1 } }
  @keyframes regPopIn  { from { opacity:0; transform:scale(.85) translateY(20px) } to { opacity:1; transform:none } }
`;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null); // { type: 'success'|'error', title, message }

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

  const showPopup = (type, title, message, onOk) => {
    setPopup({ type, title, message, onOk });
  };

  const handleRegister = async () => {
    if (!validateUsername(data.username)) {
      showPopup("error", "Invalid Username", "Use 3–20 characters: lowercase letters, numbers, dots or underscores only.");
      return;
    }
    if (data.password !== data.confirmPassword) {
      showPopup("error", "Passwords Don't Match", "Please make sure both password fields are identical.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/register", data);
      showPopup(
        "success",
        "Registered Successfully! 🎉",
        "Welcome to LifeOS! Your account is ready. You'll be taken to login now.",
        () => navigate("/login")
      );
    } catch (error) {
      showPopup(
        "error",
        "Registration Failed",
        error.response?.data?.message || "Try a different username or email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{popupStyles}</style>

      {/* ── Popup overlay ── */}
      {popup && (
        <div className="reg-popup-overlay">
          <div className="reg-popup">
            <div className={`reg-popup-icon ${popup.type}`}>
              {popup.type === "success" ? "✓" : "✕"}
            </div>
            <h3>{popup.title}</h3>
            <p>{popup.message}</p>
            <button
              className={`reg-popup-btn ${popup.type}`}
              onClick={() => {
                const cb = popup.onOk;
                setPopup(null);
                if (cb) cb();
              }}
            >
              {popup.type === "success" ? "Go to Login →" : "Try Again"}
            </button>
          </div>
        </div>
      )}

      <div className="auth-container">
        <div className="auth-blob auth-blob-blue"></div>
        <div className="auth-blob auth-blob-green"></div>
        <div className="auth-blob auth-blob-yellow"></div>
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
            Already have an account?
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;