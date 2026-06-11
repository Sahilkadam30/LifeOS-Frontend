import API from "../api";

export const getDashboard = () =>
  API.get("/gym/dashboard");

export const getWorkouts = () =>
  API.get("/gym/workouts");

export const createWorkout = (data) =>
  API.post("/gym/workouts", data);

export const updateWorkout = (id, data) =>
  API.put(`/gym/workouts/${id}`, data);

export const deleteWorkout = (id) =>
  API.delete(`/gym/workouts/${id}`);

// goals
export const getGoals = () =>
  API.get("/gym/goals");

export const createGoal = (data) =>
  API.post("/gym/goals", data);

export const updateGoal = (id, data) =>
  API.put(`/gym/goals/${id}`, data);

export const deleteGoal = (id) =>
  API.delete(`/gym/goals/${id}`);

// Meal Planner

export const getMeals = () =>
  API.get("/gym/meals");

export const createMeal = (data) =>
  API.post("/gym/meals", data);

export const updateMeal = (id, data) =>
  API.put(`/gym/meals/${id}`, data);

export const deleteMeal = (id) =>
  API.delete(`/gym/meals/${id}`);

export const getHabits = () =>
  API.get("/gym/habits");

export const createHabit = (data) =>
  API.post("/gym/habits", data);

export const toggleHabit = (id) =>
  API.put(`/gym/habits/${id}`);

export const deleteHabit = (id) =>
  API.delete(`/gym/habits/${id}`);