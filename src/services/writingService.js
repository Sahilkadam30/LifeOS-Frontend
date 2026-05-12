import API from "../api";

export const getAllWritings = async () => {
  const response = await API.get("/writings");
  return response.data;
};

export const getWritingsByType = async (type) => {
  const response = await API.get(`/writings/type/${type}`);
  return response.data;
};

export const createWriting = async (data) => {
  const response = await API.post("/writings", data);
  return response.data;
};

export const updateWriting = async (id, data) => {
  const response = await API.put(`/writings/${id}`, data);
  return response.data;
};

export const deleteWriting = async (id) => {
  await API.delete(`/writings/${id}`);
};

export const toggleFavorite = async (id) => {
  const response = await API.put(
    `/writings/favorite/${id}`
  );
  return response.data;
};