import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      className="bg-light border-end"
      style={{ width: "250px", height: "100vh" }}
    >
      <div className="list-group list-group-flush">

        <Link to="/dashboard" className="list-group-item list-group-item-action">
          Dashboard
        </Link>

        <Link to="/warehouses" className="list-group-item list-group-item-action">
          Warehouses
        </Link>

        <Link to="/zones" className="list-group-item list-group-item-action">
          Zones
        </Link>

        <Link to="/racks" className="list-group-item list-group-item-action">
          Racks
        </Link>

        <Link to="/bins" className="list-group-item list-group-item-action">
          Bins
        </Link>

        <Link to="/products" className="list-group-item list-group-item-action">
          Products
        </Link>

        <Link to="/inventory" className="list-group-item list-group-item-action">
          Inventory
        </Link>

        <Link to="/orders" className="list-group-item list-group-item-action">
          Orders
        </Link>

      </div>
    </div>
  );
}

export default Sidebar;