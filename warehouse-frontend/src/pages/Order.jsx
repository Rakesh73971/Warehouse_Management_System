import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import API from "../api/axios";
import "./pages.css";
import PageNav from "./PageNav.jsx";

const toArr  = (d) => Array.isArray(d) ? d : d?.results || [];
const STATUS = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"];

const statusBadge = {
  PENDING:   "badge badge-warning",
  APPROVED:  "badge badge-info",
  COMPLETED: "badge badge-success",
  REJECTED:  "badge badge-danger",
};

function Modal({ title, onClose, onSave, saving, children }) {
  return ReactDOM.createPortal(
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(26,25,22,0.52)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99999, backdropFilter:"blur(3px)" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background:"#fff", borderRadius:"12px", padding:"36px", width:"500px", maxWidth:"95vw", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.2)", position:"relative", zIndex:100000 }}
      >
        <h2 className="modal-title">{title}</h2>
        {children}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" disabled={saving} onClick={onSave}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function Order() {
  const [orders,   setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [count,    setCount]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [filter,   setFilter]   = useState("ALL");
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(false);
  const [show,     setShow]     = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [editing,  setEditing]  = useState(null);

  /* form */
  const [fOrderNo,  setFOrderNo]  = useState("");
  const [fCustomer, setFCustomer] = useState("");
  const [fStatus,   setFStatus]   = useState("PENDING");
  const [fItems,    setFItems]    = useState([{ product: "", quantity: "" }]);

  useEffect(() => { load(1); loadProducts(); }, []); // eslint-disable-line

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await API.get(`order/salesorders/?page=${p}&_=${Date.now()}`);
      setOrders(toArr(res.data));
      setCount(res.data?.count ?? toArr(res.data).length);
      setPage(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadProducts = async () => {
    try {
      const res = await API.get("product/products/?page_size=200");
      setProducts(toArr(res.data));
    } catch (e) { console.error(e); }
  };

  const openAdd = () => {
    setEditing(null);
    setFOrderNo(""); setFCustomer(""); setFStatus("PENDING");
    setFItems([{ product: "", quantity: "" }]);
    setShow(true);
  };

  const openEdit = (o) => {
    setEditing(o);
    setFOrderNo(o.order_number || ""); setFCustomer(o.customer_name || ""); setFStatus(o.status || "PENDING");
    setFItems(o.items?.length ? o.items.map(i => ({ product: i.product?.toString(), quantity: i.quantity?.toString() })) : [{ product: "", quantity: "" }]);
    setShow(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        order_number: fOrderNo,
        customer_name: fCustomer,
        status: fStatus,
        items: fItems.filter(i => i.product && i.quantity).map(i => ({ product: Number(i.product), quantity: Number(i.quantity) })),
      };
      editing
        ? await API.put(`order/salesorders/${editing.id}/`, payload)
        : await API.post("order/salesorders/", payload);
      setShow(false);
      load(page);
    } catch (e) { alert(JSON.stringify(e.response?.data)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await API.delete(`order/salesorders/${id}/`);
    load(page);
  };

  const updateItem = (i, field, val) => {
    const next = [...fItems];
    next[i] = { ...next[i], [field]: val };
    setFItems(next);
  };

  /* filter + search */
  const visible = orders.filter(o => {
    const matchFilter = filter === "ALL" || o.status === filter;
    const matchSearch = !search || o.order_number.toLowerCase().includes(search.toLowerCase()) || o.customer_name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="pg">
      <div className="pg-header">
        <div>
          <h1 className="pg-title">Sales Orders</h1>
          <p className="pg-sub">{count} orders total</p>
        </div>
        <div className="pg-header-right">
          <input className="pg-search" placeholder="Search order or customer…" value={search}
            onChange={e => setSearch(e.target.value)} />
          <div className="pg-filters">
            {["ALL", ...STATUS].map(s => (
              <button key={s} className={`pg-filter-btn ${filter === s ? "active" : ""}`}
                onClick={() => setFilter(s)}>
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={openAdd}>+ New Order</button>
        </div>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : !visible.length ? (
        <div className="empty-state">
          <span className="empty-icon">📑</span>
          <p className="empty-title">No orders found</p>
          <p className="empty-text">Create your first sales order.</p>
        </div>
      ) : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width:"18%"}}>Order #</th>
                <th style={{width:"25%"}}>Customer</th>
                <th style={{width:"14%"}}>Status</th>
                <th style={{width:"12%"}}>Items</th>
                <th style={{width:"16%"}}>Created</th>
                <th style={{width:"15%"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(o => (
                <tr key={o.id}>
                  <td><span className="td-mono">{o.order_number}</span></td>
                  <td>
                    <p style={{fontWeight:600, margin:"0 0 1px", fontSize:14}}>{o.customer_name}</p>
                  </td>
                  <td>
                    <span className={statusBadge[o.status] || "badge badge-neutral"}>
                      {o.status?.charAt(0) + o.status?.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td>
                    <span style={{background:"#F0EFEC", color:"#6B6860", padding:"3px 9px", borderRadius:4, fontSize:12, fontWeight:600}}>
                      {o.items?.length ?? o.salesorders?.length ?? 0} items
                    </span>
                  </td>
                  <td className="td-muted">
                    {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <div className="td-acts">
                      <button className="btn-edit" onClick={() => openEdit(o)}>Edit</button>
                      <button className="btn-del"  onClick={() => handleDelete(o.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PageNav page={page} count={count} pageSize={10} onPage={p => load(p)} />

      {show && (
        <Modal title={editing ? "Edit Order" : "New Sales Order"} onClose={() => setShow(false)} onSave={handleSave} saving={saving}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Order Number</label>
              <input className="form-input" value={fOrderNo} onChange={e => setFOrderNo(e.target.value)} placeholder="e.g. ORD-001" />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={fStatus} onChange={e => setFStatus(e.target.value)}>
                {STATUS.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Customer Name</label>
            <input className="form-input" value={fCustomer} onChange={e => setFCustomer(e.target.value)} placeholder="e.g. Acme Corp" />
          </div>

          <p className="order-items-label">Order Items</p>
          {fItems.map((item, i) => (
            <div className="order-item-row" key={i}>
              <div className="form-group">
                <label className="form-label">Product</label>
                <select className="form-select" value={item.product} onChange={e => updateItem(i, "product", e.target.value)}>
                  <option value="">Select…</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ maxWidth: 100 }}>
                <label className="form-label">Qty</label>
                <input className="form-input" type="number" min="1" value={item.quantity}
                  onChange={e => updateItem(i, "quantity", e.target.value)} placeholder="0" />
              </div>
              {fItems.length > 1 && (
                <button className="btn-rm-item" onClick={() => setFItems(fItems.filter((_, idx) => idx !== i))}>×</button>
              )}
            </div>
          ))}
          <button className="btn-add-item" onClick={() => setFItems([...fItems, { product: "", quantity: "" }])}>
            + Add Item
          </button>
        </Modal>
      )}
    </div>
  );
}