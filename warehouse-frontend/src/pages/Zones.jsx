import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Zones.css";

export default function Zones() {
  const navigate = useNavigate();

  const [zones, setZones] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [storageTypes, setStorageTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ warehouse: "", name: "", description: "", storage_type: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [zRes, wRes, sRes] = await Promise.all([
        API.get("warehouse/zones/"),
        API.get("warehouse/warehouses/"),
        API.get("warehouse/storagetypes/"),
      ]);
      setZones(Array.isArray(zRes.data) ? zRes.data : zRes.data.results || []);
      setWarehouses(Array.isArray(wRes.data) ? wRes.data : wRes.data.results || []);
      setStorageTypes(Array.isArray(sRes.data) ? sRes.data : sRes.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ warehouse: "", name: "", description: "", storage_type: "" });
    setShowModal(true);
  };

  const openEdit = (z) => {
    setEditing(z);
    setForm({
      warehouse: z.warehouse,
      name: z.name,
      description: z.description || "",
      storage_type: z.storage_type,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.warehouse) return;
    setSaving(true);
    try {
      if (editing) {
        await API.put(`warehouse/zones/${editing.id}/`, form);
      } else {
        await API.post("warehouse/zones/", form);
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this zone?")) return;
    try {
      await API.delete(`warehouse/zones/${id}/`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  // Navigate to racks page of this zone
  const handleZoneClick = (zoneId) => {
    navigate(`warehouse/zones/${zoneId}/racks`);
  };

  return (
    <div className="zones-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Zones</h1>
          <p className="page-subtitle">
            {zones.length} zone{zones.length !== 1 ? "s" : ""} across all warehouses
          </p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Zone</button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : zones.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🗺️</span>
          <p className="empty-title">No zones defined</p>
          <p className="empty-text">Create a zone inside a warehouse to continue.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Zone Name</th>
                <th>Warehouse</th>
                <th>Storage Type</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr
                  key={z.id}
                  className="clickable-row"
                  onClick={() => handleZoneClick(z.id)}
                >
                  <td>{z.name}</td>
                  <td>{z.warehouse_name || `#${z.warehouse}`}</td>
                  <td>{z.storage_type_name || `#${z.storage_type}`}</td>
                  <td>{z.description || "—"}</td>
                  <td>
                    <div className="td-actions">
                      <button
                        className="btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(z);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(z.id);
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
            <h2>{editing ? "Edit Zone" : "New Zone"}</h2>

            <div className="form-group">
              <label>Warehouse</label>
              <select
                value={form.warehouse}
                onChange={(e) => setForm({ ...form, warehouse: e.target.value })}
              >
                <option value="">Select warehouse</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Zone Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Zone A"
              />
            </div>

            <div className="form-group">
              <label>Storage Type</label>
              <select
                value={form.storage_type}
                onChange={(e) => setForm({ ...form, storage_type: e.target.value })}
              >
                <option value="">Select storage type</option>
                {storageTypes.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description…"
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