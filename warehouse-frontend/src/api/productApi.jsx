import API from "./axios";

// ================= PRODUCTS =================

// GET all products
export const getProducts = () => API.get("/products/");

// GET single product
export const getProduct = (id) => API.get(`/products/${id}/`);

// CREATE product
export const createProduct = (data) =>
  API.post("/products/", data);

// UPDATE product
export const updateProduct = (id, data) =>
  API.put(`/products/${id}/`, data);

// DELETE product
export const deleteProduct = (id) =>
  API.delete(`/products/${id}/`);