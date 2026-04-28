import axios from "axios";

const API = axios.create({
  baseURL: "",
});


// Helper to get headers with token
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default API;