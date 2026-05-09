import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../components/store/slice/auth.slice";
import "../styles/Auth.css";

const Login = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!data.username || !data.password) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await API.post("/auth/login", data);

      if (res.data.success) {
        const { token, user } = res.data.data;

        console.log("res.data.data", res.data.data);

        dispatch(login({ token, user: user }));
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id);
        navigate("/home");
      } else {
        setErrorMsg(res.data.message);
      }
    } catch (error) {
      setErrorMsg("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <input
          placeholder="Username"
          disabled={loading}
          onChange={(e) =>
            setData({ ...data, username: e.target.value.toLowerCase() })
          }
        />

        <input
          type="password"
          placeholder="Password"
          disabled={loading}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        {errorMsg && <p className="error-text">{errorMsg}</p>}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div
          className="switch-link"
          onClick={() => !loading && navigate("/register")}
        >
          Create Account
        </div>
      </div>
    </div>
  );
};

export default Login;
