import API from "../api";

export const getDashboard = () =>
  API.get("/finance/dashboard");

export const getExpenses = () =>
  API.get("/finance/expenses");

export const createExpense = (data) =>
  API.post("/finance/expenses", data);

export const updateExpense = (id, data) =>
  API.put(`/finance/expenses/${id}`, data);

export const deleteExpense = (id) =>
  API.delete(`/finance/expenses/${id}`);

// Savings

export const getSavings = () =>
  API.get("/finance/savings");

export const createSaving = (data) =>
  API.post("/finance/savings", data);

export const updateSaving = (id, data) =>
  API.put(`/finance/savings/${id}`, data);

export const deleteSaving = (id) =>
  API.delete(`/finance/savings/${id}`);

// Investments

export const getInvestments = () =>
  API.get("/finance/investments");

export const createInvestment = (data) =>
  API.post("/finance/investments", data);

export const updateInvestment = (id, data) =>
  API.put(`/finance/investments/${id}`, data);

export const deleteInvestment = (id) =>
  API.delete(`/finance/investments/${id}`);