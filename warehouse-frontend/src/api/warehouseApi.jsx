import API from "./axios";


// ================= WAREHOUSES =================

// GET
export const getWarehouses = () => API.get("/warehouses/");

// POST
export const createWarehouse = (data) =>
  API.post("/warehouses/", data);

// DELETE
export const deleteWarehouse = (id) =>
  API.delete(`/warehouses/${id}/`);


// ================= ZONES =================

// ✅ ADD THIS
export const getZones = () => API.get("/zones/");

export const createZone = (data) =>
  API.post("/zones/", data);

export const deleteZone = (id) =>
  API.delete(`/zones/${id}/`);


// ================= RACKS =================

export const getRacks = () => API.get("/racks/");
export const createRack = (data) => API.post("/racks/", data);
export const deleteRack = (id) => API.delete(`/racks/${id}/`);


// ================= BINS =================

export const getBins = () => API.get("/bins/");
export const createBin = (data) => API.post("/bins/", data);
export const deleteBin = (id) => API.delete(`/bins/${id}/`);


// ================= PRODUCTS =================

export const getProducts = () => API.get("/products/");
export const createProduct = (data) => API.post("/products/", data);
export const deleteProduct = (id) => API.delete(`/products/${id}/`);


// ================= INVENTORY =================

export const getInventory = () => API.get("/inventory/");