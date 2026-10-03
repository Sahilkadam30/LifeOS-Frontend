import API from "../api";

export const getGoals = (params = {}) => {
  return API.get("/goals", { params });
};

export const getGoalById = (id) => {
  return API.get(`/goals/${id}`);
};

export const createGoal = (data) => {
  return API.post("/goals", data);
};

export const updateGoal = (id, data) => {
  return API.put(`/goals/${id}`, data);
};

export const updateGoalProgress = (id, progressPercentage) => {
  return API.patch(`/goals/${id}/progress`, { progressPercentage });
};

export const markGoalCompleted = (id) => {
  return API.put(`/goals/${id}/complete`);
};

export const deleteGoal = (id) => {
  return API.delete(`/goals/${id}`);
};

export const getGoalStats = () => {
  return API.get("/goals/stats");
};

export const getGoalAchievements = () => {
  return API.get("/goals/achievements");
};

// ── Milestone APIs ─────────────────────────────────────────────────
export const addMilestone = (goalId, data) => {
  return API.post(`/goals/${goalId}/milestones`, data);
};

export const updateMilestone = (goalId, milestoneId, data) => {
  return API.put(`/goals/${goalId}/milestones/${milestoneId}`, data);
};

export const toggleMilestone = (goalId, milestoneId) => {
  return API.patch(`/goals/${goalId}/milestones/${milestoneId}/toggle`);
};

export const deleteMilestone = (goalId, milestoneId) => {
  return API.delete(`/goals/${goalId}/milestones/${milestoneId}`);
};

// ── Progress Journal Update APIs ───────────────────────────────────
export const addProgressUpdate = (goalId, data) => {
  return API.post(`/goals/${goalId}/updates`, data);
};

export const deleteProgressUpdate = (goalId, updateId) => {
  return API.delete(`/goals/${goalId}/updates/${updateId}`);
};
