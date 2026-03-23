import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "./Dashboard.css";

/* ── Stat Card Component ── */
function StatCard({ label, value = 0, sub, icon, iconBg }) {
  return (
    <div className="stat-card">
      <div className="stat-card-inner">
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value">{value}</p>
          {sub && <p className="stat-sub">{sub}</p>}
        </div>
        <div className="stat-icon" style={{ background: iconBg }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ── Status Badge ── */
function StatusBadge({ status }) {
  const cls = {
    PENDING:   "badge badge-pending",
    APPROVED:  "badge badge-approved",
    COMPLETED: "badge badge-completed",
    REJECTED:  "badge badge-rejected",
  }[status?.toUpperCase()] || "badge";
  return <span className={cls}>{status}</span>;
}

/* ── Dashboard Page ── */
export default function Dashboard() {
  const [stats, setStats] = useState({
    warehouses: 0,
    zones: 0,
    racks: 0,
    bins: 0,
    availableBins: 0,
    products: 0,
    inventory: 0,
    orders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const toArr = (data) => (Array.isArray(data) ? data : data.results || []);

  const fetchAll = async () => {
    try {
      const [w, z, r, b, p, o, inv] = await Promise.all([
        API.get("warehouse/warehouses/"),
        API.get("warehouse/zones/"),
        API.get("warehouse/racks/"),
        API.get("warehouse/bins/"),
        API.get("product/products/"),
        API.get("order/salesorders/"),
        API.get("product/inventories/"),
      ]);

      const bins   = b.data.results || b.data;       // if paginated, use results
      const orders = o.data.results || o.data;
      const inventoryData = inv.data;               // paginated

      setStats({
        warehouses:    w.data.count || w.data.length,
        zones:         z.data.count || z.data.length,
        racks:         r.data.count || r.data.length,
        bins:          bins.length,
        availableBins: bins.filter((x) => x.is_available).length,
        products:      p.data.count || p.data.length,
        inventory:     inventoryData.count || inventoryData.length, // total count
        orders:        orders.length,
      });

      setRecentOrders(orders.slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Warehouse management overview</p>
      </div>

      {/* Infrastructure */}
      <p className="section-label">Infrastructure</p>
      <div className="stats-grid-4">
        <StatCard label="Warehouses"  value={stats.warehouses}  icon="🏭" iconBg="#F0EFEC" />
        <StatCard label="Zones"       value={stats.zones}       icon="🗺️" iconBg="#EEF2FF" />
        <StatCard label="Racks"       value={stats.racks}       icon="🗄️" iconBg="#FEF3C7" />
        <StatCard
          label="Bins"
          value={stats.bins}
          sub={`${stats.availableBins} available`}
          icon="📦"
          iconBg="#E8F5EE"
        />
      </div>

      {/* Operations */}
      <p className="section-label">Operations</p>
      <div className="stats-grid-3">
        <StatCard label="Products"          value={stats.products}  icon="🏷️" iconBg="#EEF2FF" />
        <StatCard label="Inventory Records" value={stats.inventory} icon="📋" iconBg="#FEF3C7" />
        <StatCard label="Sales Orders"      value={stats.orders}    icon="📑" iconBg="#FDECEA" />
      </div>

      {/* Recent Orders */}
      <div className="recent-orders-header">
        <p className="section-label" style={{ margin: 0 }}>Recent Orders</p>
      </div>

      <div className="table-wrap">
        {recentOrders.length === 0 ? (
          <p className="table-empty">No orders found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="td-mono">{order.order_number}</td>
                  <td>{order.customer_name}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td className="td-muted">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}