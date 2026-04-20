import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4550/api",
});

export default API;