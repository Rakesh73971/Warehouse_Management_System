import API from "./axios";

// ── Warehouses ──
export const getWarehouses = async () => {
  try {
    const res = await API.get("warehouse/warehouses/");
    return res.data;
  } catch (err) {
    console.error("Error fetching warehouses:", err);
    throw err;
  }
};

// ── Zones ──
export const getZones = async () => {
  try {
    const res = await API.get("warehouse/zones/");
    return res.data;
  } catch (err) {
    console.error("Error fetching zones:", err);
    throw err;
  }
};

// ── Racks ──
export const getRacks = async () => {
  try {
    const res = await API.get("warehouse/racks/");
    return res.data;
  } catch (err) {
    console.error("Error fetching racks:", err);
    throw err;
  }
};

// ── Bins ──
export const getBins = async () => {
  try {
    const res = await API.get("warehouse/bins/");
    return res.data;
  } catch (err) {
    console.error("Error fetching bins:", err);
    throw err;
  }
};

// ── Storage Types ──
export const getStorageTypes = async () => {
  try {
    const res = await API.get("warehouse/storagetypes/");
    return res.data;
  } catch (err) {
    console.error("Error fetching storage types:", err);
    throw err;
  }
};