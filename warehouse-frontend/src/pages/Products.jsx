import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "./Products.css";

export default function Products() {
  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [storageTypes, setStorageTypes] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState({ name: "", sku: "", description: "", storage_type: "", category: "", weight: "" });
  const [saving, setSaving]           = useState(false);
  const [search, setSearch]           = useState("");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [p, c, s] = await Promise.all([
        API.get("product/products/"),
        API.get("product/categories/"),
        API.get("warehouse/storagetypes/"),
      ]);
      setProducts(Array.isArray(p.data) ? p.data : p.data.results || []);
      setCategories(Array.isArray(c.data) ? c.data : c.data.results || []);
      setStorageTypes(Array.isArray(s.data) ? s.data : s.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", sku: "", description: "", storage_type: "", category: "", weight: "" });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name:         p.name,
      sku:          p.sku,
      description:  p.description || "",
      storage_type: p.storage_type,
      category:     p.category,
      weight:       p.weight || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.sku.trim()) return;
    setSaving(true);
    try {
      editing
        ? await API.put(`product/products/${editing.id}/`, form)
        : await API.post("product/products/", form);
      setShowModal(false);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`product/products/${id}/`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{products.length} product{products.length !== 1 ? "s" : ""} in catalogue</p>
        </div>
        <div className="header-controls">
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or SKU…"
          />
          <button className="btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏷️</span>
          <p className="empty-title">{search ? "No results found" : "No products yet"}</p>
          <p className="empty-text">{search ? "Try a different search term." : "Add your first product to the catalogue."}</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Storage Type</th>
                <th>Weight</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="td-name">{p.name}</td>
                  <td><span className="mono-tag">{p.sku}</span></td>
                  <td>
                    {p.category_name
                      ? <span className="badge-category">{p.category_name}</span>
                      : <span className="td-muted">—</span>
                    }
                  </td>
                  <td className="td-muted">{p.storage_type_name || `#${p.storage_type}`}</td>
                  <td className="td-muted">{p.weight ? `${p.weight} kg` : "—"}</td>
                  <td className="td-date">
                    {new Date(p.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn-edit"   onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
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
            <h2 className="modal-title">{editing ? "Edit Product" : "New Product"}</h2>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input className="form-input" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Steel Bolt M8" />
              </div>
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input className="form-input" value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="e.g. SKU-001" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Storage Type</label>
                <select className="form-select" value={form.storage_type}
                  onChange={(e) => setForm({ ...form, storage_type: e.target.value })}>
                  <option value="">Select type</option>
                  {storageTypes.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input className="form-input" type="number" step="0.01" min="0"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="e.g. 1.5" />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description…" />
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