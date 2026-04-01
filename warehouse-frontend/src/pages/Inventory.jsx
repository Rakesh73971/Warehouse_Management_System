import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import API from "../api/axios";
import "./pages.css";
import PageNav from "./PageNav.jsx";
import { toast } from "../components/toast";

const toArr = (d) => Array.isArray(d) ? d : d?.results || [];

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

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [products,  setProducts]  = useState([]);
  const [bins,      setBins]      = useState([]);
  const [count,   setCount]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(false);
  const [show,    setShow]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [editing, setEditing] = useState(null);

  const [fProduct, setFProduct] = useState("");
  const [fBin,     setFBin]     = useState("");
  const [fQty,     setFQty]     = useState("0");

  useEffect(() => { load(1); loadMeta(); }, []);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await API.get(`product/inventories/?page=${p}&_=${Date.now()}`);
      setInventory(toArr(res.data));
      setCount(res.data?.count ?? toArr(res.data).length);
      setPage(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadMeta = async () => {
    try {
      const [p, b] = await Promise.all([
        API.get("product/products/?page_size=200"),
        API.get("warehouse/bins/?page_size=200"),
      ]);
      setProducts(toArr(p.data));
      setBins(toArr(b.data));
    } catch (e) { console.error(e); }
  };

  const openAdd = () => {
    setEditing(null); setFProduct(""); setFBin(""); setFQty("0");
    setShow(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFProduct(item.product?.toString() || "");
    setFBin(item.bin?.toString() || "");
    setFQty(item.quantity?.toString() || "0");
    setShow(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { product: fProduct, bin: fBin, quantity: Number(fQty) };
      editing
        ? await API.put(`product/inventories/${editing.id}/`, payload)
        : await API.post("product/inventories/", payload);
      setShow(false);
      load(page);
      toast(editing ? "Inventory updated" : "Inventory created", "success");
    } catch {
      toast("Save failed", "error");
    }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inventory record?")) return;
    try {
      await API.delete(`product/inventories/${id}/`);
      toast("Inventory deleted", "success");
      load(page);
    } catch {
      toast("Delete failed", "error");
    }
  };

  /* qty color */
  const qtyBadge = (q) => q === 0 ? "badge badge-danger" : q <= 5 ? "badge badge-warning" : "badge badge-success";

  /* filter by search */
  const filtered = search
    ? inventory.filter(i => (i.product_name || "").toLowerCase().includes(search.toLowerCase()) || (i.bin_code || "").toLowerCase().includes(search.toLowerCase()))
    : inventory;

  return (
    <div className="pg">
      <div className="pg-header">
        <div>
          <h1 className="pg-title">Inventory</h1>
          <p className="pg-sub">{count} records tracked</p>
        </div>
        <div className="pg-header-right">
          <input className="pg-search" placeholder="Search product or bin…" value={search}
            onChange={e => setSearch(e.target.value)} />
          <button className="btn-primary" onClick={openAdd}>+ Add Record</button>
        </div>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : !filtered.length ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p className="empty-title">No inventory records</p>
          <p className="empty-text">Assign products to bins to track inventory.</p>
        </div>
      ) : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width:"30%"}}>Product</th>
                <th style={{width:"16%"}}>SKU</th>
                <th style={{width:"18%"}}>Bin</th>
                <th style={{width:"14%"}}>Quantity</th>
                <th style={{width:"22%"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td className="td-bold">{item.product_name || `#${item.product}`}</td>
                  <td>
                    {item.product_sku
                      ? <span className="td-mono">{item.product_sku}</span>
                      : <span className="td-muted">—</span>}
                  </td>
                  <td>
                    <span style={{background:"#F0EFEC", padding:"3px 9px", borderRadius:4, fontSize:12, fontFamily:"var(--font-mono)", fontWeight:500}}>
                      {item.bin_code || `#${item.bin}`}
                    </span>
                  </td>
                  <td>
                    <span className={qtyBadge(item.quantity)} style={{fontSize:13, fontWeight:700}}>
                      {item.quantity} units
                    </span>
                  </td>
                  <td>
                    <div className="td-acts">
                      <button className="btn-edit" onClick={() => openEdit(item)}>Edit</button>
                      <button className="btn-del"  onClick={() => handleDelete(item.id)}>Delete</button>
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
        <Modal title={editing ? "Edit Record" : "New Inventory Record"} onClose={() => setShow(false)} onSave={handleSave} saving={saving}>
          <div className="form-group">
            <label className="form-label">Product</label>
            <select className="form-select" value={fProduct} onChange={e => setFProduct(e.target.value)}>
              <option value="">Select product…</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} — {p.sku}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Bin</label>
            <select className="form-select" value={fBin} onChange={e => setFBin(e.target.value)}>
              <option value="">Select bin…</option>
              {bins.filter(b => b.is_available).map(b => <option key={b.id} value={b.id}>{b.bin_code}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input className="form-input" type="number" min="0" value={fQty} onChange={e => setFQty(e.target.value)} />
          </div>
        </Modal>
      )}
    </div>
  );
}