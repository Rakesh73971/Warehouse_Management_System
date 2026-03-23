import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "./Order.css";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"];

export default function Order() {
  const [orders, setOrders]       = useState([]);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState({ order_number: "", customer_name: "", status: "PENDING" });
  const [items, setItems]         = useState([{ product: "", quantity: "" }]);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("ALL");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [o, p] = await Promise.all([
        API.get("order/salesorders/"),
        API.get("product/products/"),
      ]);
      setOrders(Array.isArray(o.data) ? o.data : o.data.results || []);
      setProducts(Array.isArray(p.data) ? p.data : p.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ order_number: "", customer_name: "", status: "PENDING" });
    setItems([{ product: "", quantity: "" }]);
    setShowModal(true);
  };

  const openEdit = (o) => {
    setEditing(o);
    setForm({
      order_number:  o.order_number,
      customer_name: o.customer_name,
      status:        o.status,
    });
    setItems(
      o.salesorders?.length
        ? o.salesorders.map((i) => ({ product: i.product, quantity: i.quantity }))
        : [{ product: "", quantity: "" }]
    );
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.order_number.trim() || !form.customer_name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        items: items.filter((i) => i.product && i.quantity),
      };
      editing
        ? await API.put(`order/salesorders/${editing.id}/`, payload)
        : await API.post("order/salesorders/", payload);
      setShowModal(false);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await API.delete(`order/salesorders/${id}/`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItem    = () => setItems([...items, { product: "", quantity: "" }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="orders-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Orders</h1>
          <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
        </div>
        <div className="header-controls">
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order or customer…"
          />
          <div className="filter-toggle">
            {["ALL", ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                className={`filter-btn ${filter === s ? "active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={openAdd}>+ New Order</button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📑</span>
          <p className="empty-title">{search || filter !== "ALL" ? "No results found" : "No orders yet"}</p>
          <p className="empty-text">Create your first sales order.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Items</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td><span className="order-number">{o.order_number}</span></td>
                  <td>{o.customer_name}</td>
                  <td>
                    <span className={`badge badge-${o.status}`}>{o.status}</span>
                  </td>
                  <td className="td-muted">
                    {o.salesorders?.length ?? 0} item{(o.salesorders?.length ?? 0) !== 1 ? "s" : ""}
                  </td>
                  <td className="td-date">
                    {new Date(o.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn-edit"   onClick={() => openEdit(o)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(o.id)}>Delete</button>
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
            <h2 className="modal-title">{editing ? "Edit Order" : "New Sales Order"}</h2>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Order Number</label>
                <input className="form-input" value={form.order_number}
                  onChange={(e) => setForm({ ...form, order_number: e.target.value })}
                  placeholder="e.g. ORD-001" />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Customer Name</label>
              <input className="form-input" value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                placeholder="e.g. Acme Corp" />
            </div>

            {/* Order Items */}
            <p className="items-label">Order Items</p>
            {items.map((item, index) => (
              <div className="order-item-row" key={index}>
                <div className="form-group">
                  <label className="form-label">Product</label>
                  <select className="form-select" value={item.product}
                    onChange={(e) => updateItem(index, "product", e.target.value)}>
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ maxWidth: "110px" }}>
                  <label className="form-label">Qty</label>
                  <input className="form-input" type="number" min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                    placeholder="0" />
                </div>
                {items.length > 1 && (
                  <button className="btn-remove-item" onClick={() => removeItem(index)}>×</button>
                )}
              </div>
            ))}
            <button className="btn-add-item" onClick={addItem}>+ Add Item</button>

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