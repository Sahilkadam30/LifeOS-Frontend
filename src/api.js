import axios from "axios";
import { store } from "./components/store/auth.store";
import { logout } from "./components/store/slice/auth.slice";

const API = axios.create({
  baseURL: "http://localhost:4550/api",
});

// ✅ Attach token + userId
API.interceptors.request.use((config) => {

  const state = store.getState();

  const token =
    state.auth?.token ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("token");

  const userId =
    state.auth?.user?.id ||
    sessionStorage.getItem("userId") ||
    localStorage.getItem("userId");

  // ✅ TOKEN
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ USER ID
  if (userId && !config.headers.userId) {
    config.headers.userId = userId;
  }

  return config;
});

// ✅ Handle expired token
API.interceptors.response.use(
  (res) => res,
  (err) => {

    if (err.response && err.response.status === 401) {

      store.dispatch(logout());

      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default API;