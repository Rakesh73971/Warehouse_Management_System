import React from "react";
import ReactDOM from "react-dom";
import { LVL } from "./warehouseConstants.js";


export const MODAL_CLOSED = {
  open: false, isEdit: false, editId: null, lvl: LVL.WH,
  /* Warehouse */
  fName: "", fLoc: "",
  /* Zone */
  fZoneName: "", fZoneDesc: "", fStorageType: "",
  /* Rack */
  fZone: "", fRackCode: "", fMaxCap: "",
  /* Bin */
  fBinCode: "", fCurCap: "0", fShelf: "", fPos: "", fRfid: "", fRack: "",
};

/* ═══════════════════════════════════════════════
   MODAL REDUCER
═══════════════════════════════════════════════ */
export function modalReducer(state, action) {
  switch (action.type) {

    /* ── Warehouse ── */
    case "OPEN_ADD_WH":
      return { ...MODAL_CLOSED, open: true, isEdit: false, lvl: LVL.WH };
    case "OPEN_EDIT_WH":
      return { ...MODAL_CLOSED, open: true, isEdit: true, editId: action.item.id, lvl: LVL.WH,
        fName: action.item.name     || "",
        fLoc:  action.item.location || "" };

    /* ── Zone ── */
    case "OPEN_ADD_ZONE":
      return { ...MODAL_CLOSED, open: true, isEdit: false, lvl: LVL.ZONE,
        fStorageType: action.firstStorageTypeId?.toString() || "" };
    case "OPEN_EDIT_ZONE":
      return { ...MODAL_CLOSED, open: true, isEdit: true, editId: action.item.id, lvl: LVL.ZONE,
        fZoneName:    action.item.name                      || "",
        fZoneDesc:    action.item.description               || "",
        fStorageType: action.item.storage_type?.toString()  || "" };

    /* ── Rack ── */
    case "OPEN_ADD_RACK":
      return { ...MODAL_CLOSED, open: true, isEdit: false, lvl: LVL.RACK };
    case "OPEN_EDIT_RACK":
      return { ...MODAL_CLOSED, open: true, isEdit: true, editId: action.item.id, lvl: LVL.RACK,
        fRackCode: action.item.rack_code                || "",
        fMaxCap:   action.item.max_capacity?.toString() || "" };

    /* ── Bin ── */
    case "OPEN_ADD_BIN":
      return { ...MODAL_CLOSED, open: true, isEdit: false, lvl: LVL.BINS,
        fRack: action.rackId?.toString() || "" };
    case "OPEN_EDIT_BIN":
      return { ...MODAL_CLOSED, open: true, isEdit: true, editId: action.item.id, lvl: LVL.BINS,
        fBinCode: action.item.bin_code                      || "",
        fMaxCap:  action.item.max_capacity?.toString()      || "",
        fCurCap:  action.item.current_capacity?.toString()  || "0",
        fShelf:   action.item.shelf                         || "",
        fPos:     action.item.position?.toString()          || "",
        fRfid:    action.item.rfid                          || "",
        fRack:    action.item.rack?.toString()              || "" };

    case "CLOSE":
      return { ...state, open: false };

    case "SET":
      return { ...state, [action.field]: action.value };

    default:
      return state;
  }
}

/* ═══════════════════════════════════════════════
   MODAL UI  — Portal so it's always on top
═══════════════════════════════════════════════ */
export function Modal({ title, onClose, onSave, saving, children }) {
  const content = (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(26,25,22,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 99999,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff", borderRadius: "12px", padding: "36px",
          width: "500px", maxWidth: "95vw", maxHeight: "90vh",
          overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          position: "relative", zIndex: 100000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">{title}</h2>
        {children}
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-save" disabled={saving} onClick={onSave}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
  return ReactDOM.createPortal(content, document.body);
}