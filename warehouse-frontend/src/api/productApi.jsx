import API from "./axios";

// ================= PRODUCTS =================

// GET all products
export const getProducts = () => API.get("product/products/");

// GET single product
export const getProduct = (id) => API.get(`product/products/${id}/`);

// CREATE product
export const createProduct = (data) =>
  API.post("product/products/", data);

// UPDATE product
export const updateProduct = (id, data) =>
  API.put(`product/products/${id}/`, data);

// DELETE product
export const deleteProduct = (id) =>
  API.delete(`product/products/${id}/`);