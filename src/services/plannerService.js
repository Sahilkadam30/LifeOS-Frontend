import API from "../api";

/*
=================================
Dashboard
=================================
*/

export const getDashboard = () =>
  API.get("/planner/dashboard");

/*
=================================
Tasks
=================================
*/

export const getTasks = () =>
  API.get("/planner/dashboard");

export const getTaskById = (id) =>
  API.get(`/planner/dashboard/${id}`);

export const createTask = (data) =>
  API.post("/planner/dashboard", data);

export const updateTask = (id, data) =>
  API.put(`/planner/dashboard/${id}`, data);

export const deleteTask = (id) =>
  API.delete(`/planner/dashboard/${id}`);

/*
=================================
Task Status
=================================
*/

export const markCompleted = (id) =>
  API.put(`/planner/dashboard/${id}/complete`);

export const markPending = (id) =>
  API.put(`/planner/dashboard/${id}/pending`);

/*
=================================
Priority Filters
=================================
*/

export const getHighPriorityTasks = () =>
  API.get("/planner/dashboard/priority/HIGH");

export const getMediumPriorityTasks = () =>
  API.get("/planner/dashboard/priority/MEDIUM");

export const getLowPriorityTasks = () =>
  API.get("/planner/dashboard/priority/LOW");

/*
=================================
Deadline Tracking
=================================
*/

export const getUpcomingDeadlines = () =>
  API.get("/planner/dashboard/upcoming");

export const getOverdueTasks = () =>
  API.get("/planner/dashboard/overdue");

/*
=================================
Calendar
=================================
*/

export const getCalendarTasks = () =>
  API.get("/planner/dashboard/calendar");