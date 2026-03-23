import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "./Bins.css";

/* ── Capacity Bar Component ── */
function CapacityBar({ current, max }) {
  const pct   = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
  const level = pct >= 90 ? "high" : pct >= 60 ? "medium" : "low";
  return (
    <div className="cap-bar-wrap">
      <div className="cap-bar-meta">
        <span className="cap-bar-count">{current} / {max}</span>
        <span className={`cap-bar-pct ${level}`}>{pct}%</span>
      </div>
      <div className="cap-bar-track">
        <div className={`cap-bar-fill ${level}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Bins() {
  const [bins, setBins]       = useState([]);
  const [racks, setRacks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState({ rack: "", bin_code: "", max_capacity: "", current_capacity: "0" });
  const [saving, setSaving]   = useState(false);
  const [filter, setFilter]   = useState("all");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [b, r] = await Promise.all([
        API.get("warehouse/bins/"),
        API.get("warehouse/racks/"),
      ]);
      setBins(Array.isArray(b.data) ? b.data : b.data.results || []);
      setRacks(Array.isArray(r.data) ? r.data : r.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ rack: "", bin_code: "", max_capacity: "", current_capacity: "0" });
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({
      rack:             b.rack,
      bin_code:         b.bin_code,
      max_capacity:     b.max_capacity,
      current_capacity: b.current_capacity,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.bin_code.trim() || !form.rack || !form.max_capacity) return;
    setSaving(true);
    try {
      editing
        ? await API.put(`warehouse/bins/${editing.id}/`, form)
        : await API.post("warehouse/bins/", form);
      setShowModal(false);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bin?")) return;
    try {
      await API.delete(`warehouse/bins/${id}/`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered =
    filter === "available" ? bins.filter((b) => b.is_available)  :
    filter === "full"      ? bins.filter((b) => !b.is_available) :
    bins;

  return (
    <div className="bins-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Bins</h1>
          <p className="page-subtitle">
            {bins.filter((b) => b.is_available).length} available &middot;{" "}
            {bins.filter((b) => !b.is_available).length} full
          </p>
        </div>
        <div className="header-controls">
          <div className="filter-toggle">
            {["all", "available", "full"].map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={openAdd}>+ Add Bin</button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <p className="empty-title">No bins found</p>
          <p className="empty-text">Add bins inside your racks.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bin Code</th>
                <th>Rack</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td><span className="mono-tag">{b.bin_code}</span></td>
                  <td className="td-muted">{b.rack_code || `Rack #${b.rack}`}</td>
                  <td><CapacityBar current={b.current_capacity} max={b.max_capacity} /></td>
                  <td>
                    <span className={`badge ${b.is_available ? "badge-available" : "badge-full"}`}>
                      {b.is_available ? "Available" : "Full"}
                    </span>
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn-edit"   onClick={() => openEdit(b)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(b.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">{editing ? "Edit Bin" : "New Bin"}</h2>

            <div className="form-group">
              <label className="form-label">Rack</label>
              <select
                className="form-select"
                value={form.rack}
                onChange={(e) => setForm({ ...form, rack: e.target.value })}
              >
                <option value="">Select rack</option>
                {racks.map((r) => (
                  <option key={r.id} value={r.id}>{r.rack_code}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bin Code</label>
              <input
                className="form-input"
                value={form.bin_code}
                onChange={(e) => setForm({ ...form, bin_code: e.target.value })}
                placeholder="e.g. B-001"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Max Capacity</label>
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={form.max_capacity}
                  onChange={(e) => setForm({ ...form, max_capacity: e.target.value })}
                  placeholder="e.g. 50"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Current Capacity</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={form.current_capacity}
                  onChange={(e) => setForm({ ...form, current_capacity: e.target.value })}
                  placeholder="e.g. 0"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit} disabled={saving}>
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}