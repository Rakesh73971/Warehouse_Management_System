import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const navItems = [
  { to: "/app/dashboard",  label: "Dashboard",  icon: "⬛" },
  { to: "/app/warehouses", label: "Warehouses", icon: "🏭" },
  { to: "/app/products",   label: "Products",   icon: "🏷️" },
  { to: "/app/inventory",  label: "Inventory",  icon: "📋" },
  { to: "/app/orders",     label: "Orders",     icon: "📑" },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <p className="sidebar-section-label">Menu</p>
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-link ${pathname.startsWith(to) ? "active" : ""}`}
          >
            <span className="sidebar-icon">{icon}</span>
            <span className="sidebar-label">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}