import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Racks.css";

export default function Racks() {
  const navigate = useNavigate();

  const [racks, setRacks] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ zone: "", rack_code: "", max_capacity: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rRes, zRes] = await Promise.all([
        API.get("warehouse/racks/"),
        API.get("warehouse/zones/"),
      ]);
      setRacks(Array.isArray(rRes.data) ? rRes.data : rRes.data.results || []);
      setZones(Array.isArray(zRes.data) ? zRes.data : zRes.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ zone: "", rack_code: "", max_capacity: "" });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({ zone: r.zone, rack_code: r.rack_code, max_capacity: r.max_capacity });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.rack_code.trim() || !form.zone || !form.max_capacity) return;
    setSaving(true);
    try {
      const payload = { ...form, max_capacity: Number(form.max_capacity) };
      editing
        ? await API.put(`warehouse/racks/${editing.id}/`, payload)
        : await API.post("warehouse/racks/", payload);
      setShowModal(false);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rack?")) return;
    try {
      await API.delete(`/racks/${id}/`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  // Navigate to bins page of this rack
  const handleRackClick = (rackId) => {
    navigate(`/racks/${rackId}/bins`);
  };

  return (
    <div className="racks-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Racks</h1>
          <p className="page-subtitle">
            {racks.length} rack{racks.length !== 1 ? "s" : ""} configured
          </p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Rack</button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : racks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🗄️</span>
          <p className="empty-title">No racks yet</p>
          <p className="empty-text">Add racks inside your zones.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rack Code</th>
                <th>Zone</th>
                <th>Max Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {racks.map((r) => (
                <tr
                  key={r.id}
                  className="clickable-row"
                  onClick={() => handleRackClick(r.id)}
                >
                  <td><span className="mono-tag">{r.rack_code}</span></td>
                  <td className="td-muted">{r.zone_name || `Zone #${r.zone}`}</td>
                  <td><span className="badge-capacity">{r.max_capacity} units</span></td>
                  <td>
                    <div className="td-actions">
                      <button
                        className="btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(r);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(r.id);
                        }}
                      >
                        Delete
                      </button>
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
            <h2>{editing ? "Edit Rack" : "New Rack"}</h2>

            <div className="form-group">
              <label>Zone</label>
              <select
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
              >
                <option value="">Select zone</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Rack Code</label>
              <input
                value={form.rack_code}
                onChange={(e) => setForm({ ...form, rack_code: e.target.value })}
                placeholder="e.g. R-001"
              />
            </div>

            <div className="form-group">
              <label>Max Capacity</label>
              <input
                type="number"
                min="1"
                value={form.max_capacity}
                onChange={(e) => setForm({ ...form, max_capacity: e.target.value })}
                placeholder="e.g. 100"
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleSubmit} disabled={saving}>
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}