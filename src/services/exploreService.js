import API from "../api";

export const getExploreFeed = async (type = "ALL") => {
  const response = await API.get("/explore/feed", {
    params: { type },
  });
  return response.data;
};

// ================= THOUGHT POST INTERACTIONS =================

export const toggleThoughtLike = async (id) => {
  const response = await API.post(`/explore/thought/${id}/like`);
  return response.data;
};

export const addThoughtComment = async (id, text) => {
  const response = await API.post(`/explore/thought/${id}/comment`, { text });
  return response.data;
};

export const getThoughtComments = async (id) => {
  const response = await API.get(`/explore/thought/${id}/comments`);
  return response.data;
};

export const deleteThoughtPost = async (id) => {
  const response = await API.delete(`/explore/thought/${id}`);
  return response.data;
};

// ================= ART POST INTERACTIONS =================

export const toggleArtLike = async (id) => {
  const response = await API.post(`/explore/art/${id}/like`);
  return response.data;
};

export const addArtComment = async (id, text) => {
  const response = await API.post(`/explore/art/${id}/comment`, { text });
  return response.data;
};

export const getArtComments = async (id) => {
  const response = await API.get(`/explore/art/${id}/comments`);
  return response.data;
};

export const createThoughtPost = async ({ title, content, cardColor = "#2563EB" }) => {
  const response = await API.post("/writings", {
    title,
    content,
    type: "POST",
    cardColor,
  });
  return response.data;
};
