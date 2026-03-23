import React from "react";
import { LVL } from "./warehouseConstants.js";


export default function WarehouseForm({ m, dispatch, storageTypes = [] }) {

  const set = (field) => (e) =>
    dispatch({ type: "SET", field, value: e.target.value });

  /* ── Warehouse ── */
  if (m.lvl === LVL.WH) {
    return (
      <>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" value={m.fName} onChange={set("fName")}
            placeholder="e.g. North Hub" />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" value={m.fLoc} onChange={set("fLoc")}
            placeholder="e.g. Hyderabad, Telangana" />
        </div>
      </>
    );
  }

  /* ── Zone ── */
  if (m.lvl === LVL.ZONE) {
    return (
      <>
        <div className="form-group">
          <label className="form-label">Zone Name</label>
          <input className="form-input" value={m.fZoneName} onChange={set("fZoneName")}
            placeholder="e.g. Zone A" />
        </div>
        <div className="form-group">
          <label className="form-label">Storage Type</label>
          <select className="form-select" value={m.fStorageType} onChange={set("fStorageType")}>
            <option value="">Select storage type…</option>
            {storageTypes.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={m.fZoneDesc} onChange={set("fZoneDesc")}
            placeholder="Optional description…" />
        </div>
      </>
    );
  }

  /* ── Rack ── */
  if (m.lvl === LVL.RACK) {
    return (
      <>
        <div className="form-group">
          <label className="form-label">Rack Code</label>
          <input className="form-input" value={m.fRackCode} onChange={set("fRackCode")}
            placeholder="e.g. A" />
        </div>
        <div className="form-group">
          <label className="form-label">Max Capacity</label>
          <input className="form-input" type="number" value={m.fMaxCap} onChange={set("fMaxCap")}
            placeholder="e.g. 100" />
        </div>
      </>
    );
  }

  /* ── Bin ── */
  if (m.lvl === LVL.BINS) {
    return (
      <>
        <div className="form-group">
          <label className="form-label">Bin Code</label>
          <input className="form-input" value={m.fBinCode} onChange={set("fBinCode")}
            placeholder="e.g. B-001" />
        </div>
        <div className="form-group">
          <label className="form-label">Shelf</label>
          <input className="form-input" value={m.fShelf} onChange={set("fShelf")}
            placeholder="e.g. 00" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Position</label>
            <input className="form-input" type="number" value={m.fPos} onChange={set("fPos")}
              placeholder="e.g. 1" />
          </div>
          <div className="form-group">
            <label className="form-label">RFID</label>
            <input className="form-input" value={m.fRfid} onChange={set("fRfid")}
              placeholder="e.g. RFID0001" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Max Capacity</label>
            <input className="form-input" type="number" value={m.fMaxCap} onChange={set("fMaxCap")}
              placeholder="e.g. 50" />
          </div>
          <div className="form-group">
            <label className="form-label">Current Capacity</label>
            <input className="form-input" type="number" value={m.fCurCap} onChange={set("fCurCap")}
              placeholder="0" />
          </div>
        </div>
      </>
    );
  }

  return null;
}