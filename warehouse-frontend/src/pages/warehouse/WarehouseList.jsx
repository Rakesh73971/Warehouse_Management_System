import React from "react";
import { occCls, barClr } from "./warehouseConstants.js";

/* ─── Reusable detail field (also used in BinViews) ─── */
export function Field({ label, val }) {
  return (
    <div>
      <p className="bin-field-label">{label}</p>
      <p className={`bin-field-value ${!val && val !== 0 ? "empty" : ""}`}>
        {val ?? "—"}
      </p>
    </div>
  );
}


export default function WarehouseList({ warehouses, onDrill, onEdit, onDelete }) {
  if (!warehouses.length) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🏭</span>
        <p className="empty-title">No warehouses yet</p>
        <p className="empty-text">Click "+ Add Warehouse" to create one.</p>
      </div>
    );
  }

  return (
    <div className="wh-cards-grid">
      {warehouses.map((w) => {
        const pct = Number(w.occupancy_percent) || 0;
        return (
          <div className="wh-card" key={w.id} onClick={() => onDrill(w)}>

            <div className="wh-card-body">
              <div className="wh-card-top">
                <div>
                  <p className="wh-card-name">{w.name}</p>
                  <p className="wh-card-loc">📍 {w.location}</p>
                </div>
                <span className={`occ-pill ${occCls(pct)}`}>{pct}% Full</span>
              </div>

              <div className="wh-card-stats">
                <span className="wh-stat"><strong>{w.total_bins    ?? "—"}</strong> Bins</span>
                <span className="wh-stat"><strong>{w.occupied_bins ?? "—"}</strong> Occupied</span>
                <span className="wh-stat">{w.is_active ? "🟢 Active" : "🔴 Inactive"}</span>
              </div>

              <div className="occ-bar-track">
                <div className="occ-bar-fill"
                  style={{ width: `${pct}%`, background: barClr(pct) }} />
              </div>
            </div>

            <div className="wh-card-footer">
              <span className="wh-card-hint">Click to view zones →</span>
              <div className="wh-card-actions">
                <button type="button" className="btn-sm-edit"
                  onClick={(e) => { e.stopPropagation(); onEdit(e, w); }}>Edit</button>
                <button type="button" className="btn-sm-del"
                  onClick={(e) => { e.stopPropagation(); onDelete(e, w); }}>Delete</button>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}