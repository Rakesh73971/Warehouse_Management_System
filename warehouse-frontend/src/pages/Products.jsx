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

export default function Products() {
  const [products,     setProducts]     = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [storageTypes, setStorageTypes] = useState([]);
  const [count,   setCount]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(false);
  const [show,    setShow]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [editing, setEditing] = useState(null);

  const [fName, setFName] = useState("");
  const [fSku,  setFSku]  = useState("");
  const [fDesc, setFDesc] = useState("");
  const [fCat,  setFCat]  = useState("");
  const [fSt,   setFSt]   = useState("");
  const [fWt,   setFWt]   = useState("");

  useEffect(() => { load(1); loadMeta(); }, []); // eslint-disable-line

  const load = async (p = 1, q = search) => {
    setLoading(true);
    try {
      const res = await API.get(`product/products/?page=${p}&search=${q}&_=${Date.now()}`);
      setProducts(toArr(res.data));
      setCount(res.data?.count ?? toArr(res.data).length);
      setPage(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadMeta = async () => {
    try {
      const [c, s] = await Promise.all([API.get("product/categories/"), API.get("warehouse/storagetypes/")]);
      setCategories(toArr(c.data));
      setStorageTypes(toArr(s.data));
    } catch (e) { console.error(e); }
  };

  const openAdd = () => {
    setEditing(null);
    setFName(""); setFSku(""); setFDesc(""); setFCat(""); setFSt(""); setFWt("");
    setShow(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setFName(p.name || ""); setFSku(p.sku || ""); setFDesc(p.description || "");
    setFCat(p.category?.toString() || ""); setFSt(p.storage_type?.toString() || "");
    setFWt(p.weight?.toString() || "");
    setShow(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { name: fName, sku: fSku, description: fDesc, category: fCat || null, storage_type: fSt || null, weight: fWt || null };
      editing
        ? await API.put(`product/products/${editing.id}/`, payload)
        : await API.post("product/products/", payload);
      setShow(false);
      load(page);
      toast(editing ? "Product updated" : "Product created", "success");
    } catch {
      toast("Save failed", "error");
    }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`product/products/${id}/`);
      toast("Product deleted", "success");
      load(page);
    } catch {
      toast("Delete failed", "error");
    }
  };

  return (
    <div className="pg">
      <div className="pg-header">
        <div>
          <h1 className="pg-title">Products</h1>
          <p className="pg-sub">{count} products in catalogue</p>
        </div>
        <div className="pg-header-right">
          <input className="pg-search" placeholder="Search products…" value={search}
            onChange={e => { setSearch(e.target.value); load(1, e.target.value); }} />
          <button className="btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : !products.length ? (
        <div className="empty-state">
          <span className="empty-icon">🏷️</span>
          <p className="empty-title">No products found</p>
          <p className="empty-text">Add your first product to the catalogue.</p>
        </div>
      ) : (
        <div className="tbl-wrap">
          <table className="tbl products-tbl">
            <thead>
              <tr>
                <th style={{width:"30%"}}>Product</th>
                <th style={{width:"15%"}}>SKU</th>
                <th style={{width:"15%"}}>Category</th>
                <th style={{width:"15%"}}>Storage Type</th>
                <th style={{width:"10%"}}>Weight</th>
                <th className="actions-col" style={{width:"15%"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <p style={{fontWeight:600, margin:"0 0 2px", fontSize:14}}>{p.name}</p>
                    {p.description && <p style={{margin:0, fontSize:12, color:"var(--text-muted)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:240}}>{p.description}</p>}
                  </td>
                  <td><span className="td-mono">{p.sku}</span></td>
                  <td>
                    {p.category_name
                      ? <span className="badge badge-neutral">{p.category_name}</span>
                      : <span className="td-muted">—</span>}
                  </td>
                  <td>
                    {p.storage_type_name
                      ? <span className="badge badge-info">{p.storage_type_name}</span>
                      : <span className="td-muted">—</span>}
                  </td>
                  <td className="td-muted">{p.weight ? `${p.weight} kg` : "—"}</td>
                  <td className="actions-cell">
                    <div className="td-acts">
                      <button
                        type="button"
                        className="btn-edit"
                        title="Edit product"
                        onClick={() => openEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-del"
                        title="Delete product"
                        onClick={() => handleDelete(p.id)}
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

      <PageNav page={page} count={count} pageSize={10} onPage={p => load(p)} />

      {show && (
        <Modal title={editing ? "Edit Product" : "New Product"} onClose={() => setShow(false)} onSave={handleSave} saving={saving}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={fName} onChange={e => setFName(e.target.value)} placeholder="e.g. Steel Bolt" />
            </div>
            <div className="form-group">
              <label className="form-label">SKU</label>
              <input className="form-input" value={fSku} onChange={e => setFSku(e.target.value)} placeholder="e.g. SKU-001" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={fCat} onChange={e => setFCat(e.target.value)}>
                <option value="">Select…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Storage Type</label>
              <select className="form-select" value={fSt} onChange={e => setFSt(e.target.value)}>
                <option value="">Select…</option>
                {storageTypes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input className="form-input" type="number" step="0.01" value={fWt} onChange={e => setFWt(e.target.value)} placeholder="e.g. 1.5" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={fDesc} onChange={e => setFDesc(e.target.value)} placeholder="Optional…" />
          </div>
        </Modal>
      )}
    </div>
  );
}