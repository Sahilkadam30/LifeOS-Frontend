import API from "../api";

// Dashboard

export const getSkillDashboard = () =>
  API.get("/skills/dashboard");

// Subjects

export const getSubjects = () =>
  API.get("/skills/subjects");

export const createSubject = (data) =>
  API.post("/skills/subjects", data);

export const updateSubject = (id, data) =>
  API.put(`/skills/subjects/${id}`, data);

export const deleteSubject = (id) =>
  API.delete(`/skills/subjects/${id}`);

// Study Sessions

export const getStudySessions = () =>
  API.get("/skills/study-sessions");

export const createStudySession = (data) =>
  API.post("/skills/study-sessions", data);

export const updateStudySession = (id, data) =>
  API.put(`/skills/study-sessions/${id}`, data);

export const deleteStudySession = (id) =>
  API.delete(`/skills/study-sessions/${id}`);

// Learning Journal

export const getJournals = () =>
  API.get("/skills/journals");

export const createJournal = (data) =>
  API.post("/skills/journals", data);

export const deleteJournal = (id) =>
  API.delete(`/skills/journals/${id}`);

// Skill Progress

export const getSkillProgress = () =>
  API.get("/skills/progress");

export const createSkillProgress = (data) =>
  API.post("/skills/progress", data);

export const updateSkillProgress = (id, data) =>
  API.put(`/skills/progress/${id}`, data);

export const deleteSkillProgress = (id) =>
  API.delete(`/skills/progress/${id}`);

// Achievements

export const getAchievements = () =>
  API.get("/skills/achievements");