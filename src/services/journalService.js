import API from "../api";

// Stats
export const getJournalStats = () => API.get("/journal/stats");

// Movies
export const getMovies = (status) =>
  API.get(status ? `/journal/movies?status=${status}` : "/journal/movies");

export const createMovie = (data) => API.post("/journal/movies", data);

export const updateMovie = (id, data) => API.put(`/journal/movies/${id}`, data);

export const deleteMovie = (id) => API.delete(`/journal/movies/${id}`);

// Books
export const getBooks = (status) =>
  API.get(status ? `/journal/books?status=${status}` : "/journal/books");

export const createBook = (data) => API.post("/journal/books", data);

export const updateBook = (id, data) => API.put(`/journal/books/${id}`, data);

export const deleteBook = (id) => API.delete(`/journal/books/${id}`);

// Food
export const getFood = (status) =>
  API.get(status ? `/journal/food?status=${status}` : "/journal/food");

export const createFood = (data) => API.post("/journal/food", data);

export const updateFood = (id, data) => API.put(`/journal/food/${id}`, data);

export const deleteFood = (id) => API.delete(`/journal/food/${id}`);

// Categories
export const getCategories = () => API.get("/journal/categories");

export const createCategory = (data) => API.post("/journal/categories", data);

export const deleteCategory = (id) => API.delete(`/journal/categories/${id}`);

// Favourites
export const getFavourites = (categoryId) =>
  API.get(categoryId ? `/journal/favourites?categoryId=${categoryId}` : "/journal/favourites");

export const createFavourite = (data) => API.post("/journal/favourites", data);

export const deleteFavourite = (id) => API.delete(`/journal/favourites/${id}`);
