import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation(); // To highlight active link

  const links = [
    { path: "/app/dashboard", label: "Dashboard" },
    { path: "/app/warehouses", label: "Warehouses" },
    { path: "/app/zones", label: "Zones" },
    { path: "/app/racks", label: "Racks" },
    { path: "/app/bins", label: "Bins" },
    { path: "/app/products", label: "Products" },
    { path: "/app/inventory", label: "Inventory" },
    { path: "/app/orders", label: "Orders" },
  ];

  return (
    <div
      className="bg-light border-end d-flex flex-column"
      style={{ width: "220px", minHeight: "100vh" }}
    >
      <div className="p-3 fs-5 fw-bold border-bottom">Menu</div>
      <div className="list-group list-group-flush flex-grow-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`list-group-item list-group-item-action ${
              location.pathname === link.path ? "active fw-bold" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;