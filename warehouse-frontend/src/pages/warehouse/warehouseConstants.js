/* ─── Navigation levels ─── */
export const LVL = {
  WH:         0,
  ZONE:       1,
  RACK:       2,
  BINS:       3,
  BIN_DETAIL: 4,
};

/* ─── Utilities ─── */
export const toArr  = (d) => Array.isArray(d) ? d : (d?.results || []);
export const occCls = (p) => p >= 70 ? "occ-high" : p >= 35 ? "occ-med" : "occ-low";
export const barClr = (p) => p >= 70 ? "var(--occ-high)" : p >= 35 ? "var(--occ-med)" : "var(--occ-low)";
export const ts     = ()  => `_=${Date.now()}`;