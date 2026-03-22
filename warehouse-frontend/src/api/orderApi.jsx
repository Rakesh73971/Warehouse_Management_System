import API from "./axios";

// ================= ORDERS =================

// GET all orders
export const getOrders = () => API.get("/orders/");

// GET single order
export const getOrder = (id) => API.get(`/orders/${id}/`);

// CREATE order
export const createOrder = (data) =>
  API.post("/orders/", data);

// UPDATE order
export const updateOrder = (id, data) =>
  API.put(`/orders/${id}/`, data);

// DELETE order
export const deleteOrder = (id) =>
  API.delete(`/orders/${id}/`);