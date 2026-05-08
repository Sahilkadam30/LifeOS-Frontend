// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:4550/api",
// });


// // Helper to get headers with token
// export const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// export default API;

import axios from "axios";
import { store } from "./components/store/auth.store";

const API = axios.create({
  baseURL: "http://localhost:4550/api",
});

// ✅ Attach token
API.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

import { logout } from "./components/store/slice/auth.slice";

// ✅ Handle expired token
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // 🔥 Token expired or invalid
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;