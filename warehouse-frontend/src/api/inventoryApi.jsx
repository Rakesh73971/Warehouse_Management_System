import API from "./axios";

// ================= INVENTORY =================

// GET all inventory
export const getInventory = () => API.get("/inventory/");

// GET single inventory item
export const getInventoryItem = (id) =>
  API.get(`/inventory/${id}/`);

// CREATE inventory
export const createInventory = (data) =>
  API.post("/inventory/", data);

// UPDATE inventory
export const updateInventory = (id, data) =>
  API.put(`/inventory/${id}/`, data);

// DELETE inventory
export const deleteInventory = (id) =>
  API.delete(`/inventory/${id}/`);