import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "./Inventory.css";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts]   = useState([]);
  const [bins, setBins]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState({ product: "", bin: "", quantity: "" });
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState("");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [inv, p, b] = await Promise.all([
        API.get("product/inventories/"),
        API.get("product/products/"),
        API.get("warehouse/bins/"),
      ]);
      setInventory(Array.isArray(inv.data) ? inv.data : inv.data.results || []);
      setProducts(Array.isArray(p.data) ? p.data : p.data.results || []);
      setBins(Array.isArray(b.data) ? b.data : b.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ product: "", bin: "", quantity: "" });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ product: item.product, bin: item.bin, quantity: item.quantity });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.product || !form.bin || !form.quantity) return;
    setSaving(true);
    try {
      editing
        ? await API.put(`product/inventory/${editing.id}/`, form)
        : await API.post("product/inventory/", form);
      setShowModal(false);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inventory record?")) return;
    try {
      await API.delete(`product/inventory/${id}/`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const getQtyClass = (qty) =>
    qty === 0 ? "qty-zero" : qty <= 5 ? "qty-low" : "qty-ok";

  const filtered = inventory.filter((item) => {
    const name = item.product_name || "";
    const bin  = item.bin_code     || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      bin.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="inventory-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">{inventory.length} record{inventory.length !== 1 ? "s" : ""} tracked</p>
        </div>
        <div className="header-controls">
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product or bin…"
          />
          <button className="btn-primary" onClick={openAdd}>+ Add Record</button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p className="empty-title">{search ? "No results found" : "No inventory records"}</p>
          <p className="empty-text">{search ? "Try a different search term." : "Assign products to bins to track inventory."}</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Bin</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="td-name">{item.product_name || `Product #${item.product}`}</td>
                  <td>
                    {item.product_sku
                      ? <span className="mono-tag">{item.product_sku}</span>
                      : <span className="td-muted">—</span>
                    }
                  </td>
                  <td className="td-muted">{item.bin_code || `Bin #${item.bin}`}</td>
                  <td>
                    <span className={`qty-badge ${getQtyClass(item.quantity)}`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn-edit"   onClick={() => openEdit(item)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
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
            <h2 className="modal-title">{editing ? "Edit Record" : "New Inventory Record"}</h2>

            <div className="form-group">
              <label className="form-label">Product</label>
              <select className="form-select" value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}>
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {p.sku}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bin</label>
              <select className="form-select" value={form.bin}
                onChange={(e) => setForm({ ...form, bin: e.target.value })}>
                <option value="">Select bin</option>
                {bins.filter((b) => b.is_available).map((b) => (
                  <option key={b.id} value={b.id}>{b.bin_code}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input className="form-input" type="number" min="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="e.g. 100" />
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