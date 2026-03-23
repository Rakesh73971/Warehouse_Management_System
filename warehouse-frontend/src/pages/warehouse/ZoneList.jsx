import React from "react";

/* ═══════════════════════════════════════════════
   ZONE CARD LIST  — Level 1
   Displays zones as clickable cards, consistent
   with the Warehouse card grid style.

   Props:
     zones    — array of zone objects
     onDrill  — (zone) => void
     onEdit   — (e, zone) => void
     onDelete — (e, zone) => void
═══════════════════════════════════════════════ */

const ZONE_COLORS = [
  { bar: "#3B82F6", bg: "#EFF6FF", text: "#1D4ED8" },
  { bar: "#8B5CF6", bg: "#F5F3FF", text: "#6D28D9" },
  { bar: "#10B981", bg: "#ECFDF5", text: "#065F46" },
  { bar: "#F59E0B", bg: "#FFFBEB", text: "#92400E" },
  { bar: "#EF4444", bg: "#FEF2F2", text: "#991B1B" },
  { bar: "#06B6D4", bg: "#ECFEFF", text: "#155E75" },
];

export default function ZoneList({ zones, onDrill, onEdit, onDelete }) {
  if (!zones.length) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🗺️</span>
        <p className="empty-title">No zones in this warehouse</p>
        <p className="empty-text">Add your first zone to get started.</p>
      </div>
    );
  }

  return (
    <div className="zone-cards-grid">
      {zones.map((z, i) => {
        const color = ZONE_COLORS[i % ZONE_COLORS.length];
        return (
          <div className="zone-card" key={z.id} onClick={() => onDrill(z)}>

            {/* Colored top bar */}
            <div className="zone-card-bar" style={{ background: color.bar }} />

            <div className="zone-card-body">
              {/* Icon + Name row */}
              <div className="zone-card-top">
                <div
                  className="zone-icon-wrap"
                  style={{ background: color.bg, color: color.text }}
                >
                  🗺️
                </div>
                <div className="zone-card-title-wrap">
                  <p className="zone-card-name">{z.name}</p>
                  {z.storage_type_name && (
                    <span
                      className="zone-type-badge"
                      style={{ background: color.bg, color: color.text }}
                    >
                      {z.storage_type_name}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {z.description && (
                <p className="zone-card-desc">{z.description}</p>
              )}
            </div>

            {/* Footer */}
            <div className="zone-card-footer">
              <span className="zone-card-hint">View racks →</span>
              <div className="zone-card-actions">
                <button
                  type="button" className="btn-sm-edit"
                  onClick={(e) => { e.stopPropagation(); onEdit(e, z); }}
                >Edit</button>
                <button
                  type="button" className="btn-sm-del"
                  onClick={(e) => { e.stopPropagation(); onDelete(e, z); }}
                >Delete</button>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}