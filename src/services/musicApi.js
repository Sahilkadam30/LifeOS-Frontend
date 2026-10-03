import API from "../api";
import { store } from "../components/store/auth.store";

/**
 * Returns current auth token from redux store or storage
 */
export const getAuthToken = () => {
  const state = store.getState();
  return (
    state.auth?.token ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("token") ||
    ""
  );
};

/**
 * Build stream URL with authentication token and userId for direct HTML5 audio playback
 */
export const getStreamUrl = (recordingId) => {
  const token = getAuthToken();
  const userId =
    store.getState()?.auth?.user?.id ||
    sessionStorage.getItem("userId") ||
    localStorage.getItem("userId") ||
    "";
  const base = API.defaults.baseURL || "http://localhost:4550/api";
  const params = new URLSearchParams();
  if (token && token !== "null" && token !== "undefined") {
    params.append("token", token);
  }
  if (userId && userId !== "null" && userId !== "undefined") {
    params.append("userId", userId);
  }
  const queryStr = params.toString();
  return `${base}/music/recordings/${recordingId}/stream${queryStr ? `?${queryStr}` : ""}`;
};

/**
 * Upload recording with progress tracking
 */
export const uploadRecording = async (formData, onProgress) => {
  const response = await API.post("/music/recordings/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return response.data;
};

/**
 * Fetch all recordings with optional filters
 */
export const getRecordings = async (params = {}) => {
  const response = await API.get("/music/recordings", { params });
  return response.data;
};

/**
 * Get single recording by ID
 */
export const getRecordingById = async (id) => {
  const response = await API.get(`/music/recordings/${id}`);
  return response.data;
};

/**
 * Update recording metadata
 */
export const updateRecording = async (id, data) => {
  const response = await API.put(`/music/recordings/${id}`, data);
  return response.data;
};

/**
 * Delete recording
 */
export const deleteRecording = async (id) => {
  const response = await API.delete(`/music/recordings/${id}`);
  return response.data;
};

/**
 * Toggle favorite status
 */
export const toggleFavoriteRecording = async (id) => {
  const response = await API.patch(`/music/recordings/${id}/favorite`);
  return response.data;
};

/**
 * Get music studio summary metrics
 */
export const getMusicStats = async () => {
  const response = await API.get("/music/stats");
  return response.data;
};

/**
 * Project API endpoints
 */
export const getProjects = async () => {
  const response = await API.get("/music/projects");
  return response.data;
};

export const createProject = async (data) => {
  const response = await API.post("/music/projects", data);
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await API.put(`/music/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await API.delete(`/music/projects/${id}`);
  return response.data;
};

/**
 * Securely downloads audio file with token header and browser save dialog
 */
export const downloadRecordingFile = async (recordingId, preferredFilename = "recording.mp3") => {
  const response = await API.get(`/music/recordings/${recordingId}/download`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", preferredFilename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};
