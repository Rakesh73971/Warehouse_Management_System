import API from "./axios";

// ================= INVENTORY =================

// GET all inventory
export const getInventory = () => API.get("product/inventories/");

// GET single inventory item
export const getInventoryItem = (id) =>
  API.get(`product/inventories/${id}/`);

// CREATE inventory
export const createInventory = (data) =>
  API.post("product/inventories/", data);

// UPDATE inventory
export const updateInventory = (id, data) =>
  API.put(`product/inventories/${id}/`, data);

// DELETE inventory
export const deleteInventory = (id) =>
  API.delete(`product/inventories/${id}/`);