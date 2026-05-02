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

const API = axios.create({
  baseURL: "http://localhost:4550/api",
});

// ✅ Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Handle expired token
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // 🔥 Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;