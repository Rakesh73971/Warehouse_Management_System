import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import API from "../../api/axios";
import { Field } from "./WarehouseList.jsx";

/* ═══════════════════════════════════════════════
   BIN VISUAL GRID  — Level 3
═══════════════════════════════════════════════ */
export function BinGrid({ bins, onDrill }) {
  if (!bins.length) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📦</span>
        <p className="empty-title">No bins in this rack</p>
        <p className="empty-text">Add bins to get started.</p>
      </div>
    );
  }

  const byShelf   = bins.reduce((acc, b) => {
    const shelf = b.shelf || "—";
    acc[shelf]  = acc[shelf] || [];
    acc[shelf].push(b);
    return acc;
  }, {});
  const freeCount = bins.filter(b => b.is_available).length;

  return (
    <>
      <div className="bin-controls">
        <div className="bin-legend">
          <div className="bin-legend-item">
            <div className="bin-legend-dot free" />Available ({freeCount})
          </div>
          <div className="bin-legend-item">
            <div className="bin-legend-dot occ" />Occupied ({bins.length - freeCount})
          </div>
        </div>
      </div>
      {Object.entries(byShelf).sort().map(([shelf, shelfBins]) => (
        <div className="bin-shelf-section" key={shelf}>
          <p className="bin-shelf-label">Shelf {shelf}</p>
          <div className="bin-flex-grid">
            {[...shelfBins]
              .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
              .map((b) => (
                <div key={b.id}
                  className={`bin-cell ${b.is_available ? "free" : "occ"}`}
                  onClick={() => onDrill(b)}
                  title={`${b.bin_code} — ${b.is_available ? "Available" : "Occupied"}`}
                >
                  {b.position ?? b.bin_code}
                </div>
              ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════
   ADD PRODUCT MODAL
   Creates a StockMovement (INBOUND) to assign
   a product to an empty bin.
═══════════════════════════════════════════════ */
function AddProductModal({ bin, onClose, onSuccess }) {
  const [products,  setProducts]  = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity,  setQuantity]  = useState("1");
  const [notes,     setNotes]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");

  /* Load products on mount */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await API.get("product/products/?page_size=200");
        const items = Array.isArray(res.data) ? res.data : res.data.results || [];
        setProducts(items);
      } catch (e) {
        console.error("[AddProduct] fetch products:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAdd = async () => {
    if (!productId) { setError("Please select a product."); return; }
    if (!quantity || Number(quantity) < 1) { setError("Quantity must be at least 1."); return; }

    /* Check bin capacity */
    const qty = Number(quantity);
    const remaining = bin.max_capacity - bin.current_capacity;
    if (qty > remaining) {
      setError(`Only ${remaining} unit(s) of space left in this bin.`);
      return;
    }

    setSaving(true);
    setError("");
    try {
      /* Create INBOUND stock movement — serializer handles inventory update */
      await API.post("product/stockmovements/", {
        product:       Number(productId),
        bin:           bin.id,
        quantity:      qty,
        movement_type: "INBOUND",
        notes:         notes,
      });
      onSuccess();
    } catch (e) {
      const msg = e.response?.data;
      setError(typeof msg === "object" ? JSON.stringify(msg) : String(msg));
    } finally {
      setSaving(false);
    }
  };

  const content = (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(26,25,22,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 99999,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff", borderRadius: "12px", padding: "36px",
          width: "480px", maxWidth: "95vw", maxHeight: "90vh",
          overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          zIndex: 100000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ap-modal-header">
          <h2 className="modal-title" style={{ margin: 0 }}>Add Product to Bin</h2>
          <span className="ap-bin-tag">{bin.bin_code}</span>
        </div>
        <p className="ap-modal-sub">
          Available space: <strong>{bin.max_capacity - bin.current_capacity}</strong> / {bin.max_capacity} units
        </p>

        {/* Product select */}
        <div className="form-group" style={{ marginTop: 20 }}>
          <label className="form-label">Product</label>
          {loading ? (
            <p style={{ fontSize: 13, color: "#9E9B94" }}>Loading products…</p>
          ) : (
            <select
              className="form-select"
              value={productId}
              onChange={(e) => { setProductId(e.target.value); setError(""); }}
            >
              <option value="">Select a product…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.sku}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Quantity */}
        <div className="form-group">
          <label className="form-label">Quantity</label>
          <input
            className="form-input"
            type="number"
            min="1"
            max={bin.max_capacity - bin.current_capacity}
            value={quantity}
            onChange={(e) => { setQuantity(e.target.value); setError(""); }}
          />
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes (optional)</label>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Received from supplier #123"
            rows={2}
          />
        </div>

        {/* Error */}
        {error && <p className="ap-error">{error}</p>}

        {/* Actions */}
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-save" disabled={saving} onClick={handleAdd}>
            {saving ? "Adding…" : "Add to Bin"}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}

/* ═══════════════════════════════════════════════
   REMOVE PRODUCT MODAL
   Creates a StockMovement (OUTBOUND) to remove
   a product from a bin.
═══════════════════════════════════════════════ */
function RemoveProductModal({ bin, inventory, product, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState("1");
  const [notes,    setNotes]    = useState("");
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");

  const handleRemove = async () => {
    const qty = Number(quantity);
    if (!qty || qty < 1) { setError("Quantity must be at least 1."); return; }
    if (qty > inventory.quantity) {
      setError(`Only ${inventory.quantity} unit(s) available in this bin.`);
      return;
    }

    setSaving(true);
    setError("");
    try {
      await API.post("product/stockmovements/", {
        product:       inventory.product,
        bin:           bin.id,
        quantity:      qty,
        movement_type: "OUTBOUND",
        notes:         notes,
      });
      onSuccess();
    } catch (e) {
      const msg = e.response?.data;
      setError(typeof msg === "object" ? JSON.stringify(msg) : String(msg));
    } finally {
      setSaving(false);
    }
  };

  const content = (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(26,25,22,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 99999,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff", borderRadius: "12px", padding: "36px",
          width: "440px", maxWidth: "95vw",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)", zIndex: 100000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ap-modal-header">
          <h2 className="modal-title" style={{ margin: 0 }}>Remove Product</h2>
          <span className="ap-bin-tag remove">{bin.bin_code}</span>
        </div>
        <p className="ap-modal-sub">
          <strong>{product?.name}</strong> · {inventory.quantity} unit(s) currently in bin
        </p>

        <div className="form-group" style={{ marginTop: 20 }}>
          <label className="form-label">Quantity to Remove</label>
          <input
            className="form-input"
            type="number"
            min="1"
            max={inventory.quantity}
            value={quantity}
            onChange={(e) => { setQuantity(e.target.value); setError(""); }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes (optional)</label>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Dispatched to order #456"
            rows={2}
          />
        </div>

        {error && <p className="ap-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn-save"
            style={{ background: "#C0392B" }}
            disabled={saving}
            onClick={handleRemove}
          >
            {saving ? "Removing…" : "Remove from Bin"}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}

/* ═══════════════════════════════════════════════
   BIN DETAIL  — Level 4
═══════════════════════════════════════════════ */
export function BinDetail({ bin }) {
  const [inventory,   setInventory]   = useState(null);
  const [product,     setProduct]     = useState(null);
  const [invLoading,  setInvLoading]  = useState(false);
  const [showAdd,     setShowAdd]     = useState(false);
  const [showRemove,  setShowRemove]  = useState(false);
  const binId = bin?.id;

  useEffect(() => {
    if (!binId) return;
    fetchInventory(binId);
  }, [binId]);

  const fetchInventory = async (binId) => {
    setInvLoading(true);
    setInventory(null);
    setProduct(null);
    try {
      const res = await API.get(`product/inventories/?bin=${binId}`);
      const items = Array.isArray(res.data) ? res.data : res.data.results || [];
      if (items.length > 0) {
        const inv = items[0];
        setInventory(inv);
        const pRes = await API.get(`product/products/${inv.product}/`);
        setProduct(pRes.data);
      }
    } catch (e) {
      console.error("[BinDetail] fetch error:", e);
    } finally {
      setInvLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setShowAdd(false);
    fetchInventory(bin.id);
  };

  const handleRemoveSuccess = () => {
    setShowRemove(false);
    fetchInventory(bin.id);
  };

  if (!bin) return null;

  const isEmpty = !invLoading && !inventory;

  return (
    <div className="bin-detail-wrap">

      {/* ── Bin Information ── */}
      <div className="bin-detail-card">
        <p className="bin-detail-title">Bin Information</p>
        <div className="bin-detail-fields">
          <Field label="Bin ID"   val={bin.bin_code} />
          <Field label="Position" val={bin.position} />
          <Field label="Shelf"    val={bin.shelf} />
          <Field label="RFID"     val={bin.rfid} />
          <Field label="Capacity" val={`${bin.current_capacity} / ${bin.max_capacity}`} />
          <div>
            <p className="bin-field-label">Status</p>
            <span className={`bin-status-pill ${bin.is_available ? "avail" : "full"}`}>
              {bin.is_available ? "Available" : "Occupied"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Product Details ── */}
      <div className="bin-detail-card">
        <div className="bin-detail-card-header">
          <p className="bin-detail-title">Product Details</p>
          {invLoading && <div className="inv-spinner" />}

          {/* Action buttons */}
          {!invLoading && isEmpty && (
            <button
              type="button"
              className="btn-add-product"
              onClick={() => setShowAdd(true)}
            >
              + Add Product
            </button>
          )}
          {!invLoading && inventory && (
            <button
              type="button"
              className="btn-remove-product"
              onClick={() => setShowRemove(true)}
            >
              − Remove Product
            </button>
          )}
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div className="bin-empty-product">
            <span className="bin-empty-icon">📭</span>
            <p className="bin-empty-text">This bin is empty.</p>
            <p className="bin-empty-sub">Click "Add Product" to assign stock.</p>
          </div>
        )}

        {/* Product info */}
        {product && inventory && (
          <div className="bin-detail-fields">
            <Field label="Product Name" val={product.name} />
            <Field label="SKU"          val={product.sku} />
            <Field label="Category"     val={product.category_name || null} />
            <Field label="Storage Type" val={product.storage_type_name || null} />
            <Field label="Weight"       val={product.weight ? `${product.weight} kg` : null} />
            <Field label="Qty in Bin"   val={inventory.quantity} />
            {product.description && (
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Description" val={product.description} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showAdd && (
        <AddProductModal
          bin={bin}
          onClose={() => setShowAdd(false)}
          onSuccess={handleAddSuccess}
        />
      )}
      {showRemove && inventory && product && (
        <RemoveProductModal
          bin={bin}
          inventory={inventory}
          product={product}
          onClose={() => setShowRemove(false)}
          onSuccess={handleRemoveSuccess}
        />
      )}

    </div>
  );
}