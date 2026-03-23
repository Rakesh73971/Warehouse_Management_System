import React from "react";
import { occCls, barClr } from "./warehouseConstants.js";


export default function RackList({ racks, onDrill, onEdit, onDelete }) {
  if (!racks.length) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🗄️</span>
        <p className="empty-title">No racks in this zone</p>
        <p className="empty-text">Add your first rack to get started.</p>
      </div>
    );
  }

  return (
    <div className="rack-grid">
      {racks.map((r) => {
        const pct = Number(r.occupancy_percent) || 0;
        return (
          <div className="rack-card" key={r.id} onClick={() => onDrill(r)}>

            <div className="rack-card-top">
              <div className="rack-letter">{r.rack_code}</div>
              <p className="rack-code">Rack {r.rack_code}</p>
              <p className="rack-bins">{r.total_bins ?? "—"} bins</p>
              <p className={`rack-occ-label ${occCls(pct)}`}>{pct}% occupied</p>
            </div>

            <div className="rack-bar-track">
              <div className="rack-bar-fill"
                style={{ width: `${pct}%`, background: barClr(pct) }} />
            </div>

            <div className="rack-card-footer">
              <span className="rack-card-hint">View bins →</span>
              <div className="rack-card-actions">
                <button type="button" className="btn-sm-edit"
                  onClick={(e) => { e.stopPropagation(); onEdit(e, r); }}>Edit</button>
                <button type="button" className="btn-sm-del"
                  onClick={(e) => { e.stopPropagation(); onDelete(e, r); }}>Delete</button>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}