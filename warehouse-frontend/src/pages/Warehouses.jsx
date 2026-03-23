import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Warehouses.css";

export default function Warehouses() {
  const navigate = useNavigate();

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", location: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch warehouses from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("warehouse/warehouses/");
      setWarehouses(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for adding new warehouse
  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", location: "" });
    setShowModal(true);
  };

  // Open modal for editing warehouse
  const openEdit = (w) => {
    setEditing(w);
    setForm({ name: w.name, location: w.location });
    setShowModal(true);
  };

  // Submit add/edit form
  const handleSubmit = async () => {
    if (!form.name.trim() || !form.location.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await API.put(`warehouse/warehouses/${editing.id}/`, form);
      } else {
        await API.post("warehouse/warehouses/", form);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Delete warehouse
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this warehouse?")) return;
    try {
      await API.delete(`warehouse/warehouses/${id}/`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Navigate to zones page
  const handleWarehouseClick = (id) => {
    navigate(`/warehouses/${id}/zones`);
  };

  return (
    <div className="warehouses-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Warehouses</h1>
          <p className="page-subtitle">
            {warehouses.length} location{warehouses.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Warehouse</button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : warehouses.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏭</span>
          <p className="empty-title">No warehouses yet</p>
          <p className="empty-text">Add your first warehouse to get started.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Manager</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((w) => (
                <tr
                  key={w.id}
                  className="clickable-row"
                  onClick={() => handleWarehouseClick(w.id)}
                >
                  <td className="td-name">{w.name}</td>
                  <td className="td-muted">{w.location}</td>
                  <td className="td-muted">{w.manager_email || w.manager || "—"}</td>
                  <td>
                    <span className={`badge ${w.is_active ? "badge-active" : "badge-inactive"}`}>
                      {w.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="td-date">
                    {new Date(w.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="td-actions">
                      {/* Stop propagation so clicking buttons doesn't trigger row click */}
                      <button
                        className="btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(w);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(w.id);
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
            <h2 className="modal-title">{editing ? "Edit Warehouse" : "New Warehouse"}</h2>

            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. North Hub"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                className="form-input"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Hyderabad, Telangana"
              />
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