import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState("Admin"); // Replace with dynamic user if needed

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow-sm">
      <span className="navbar-brand fs-4 fw-bold">
        Warehouse Management
      </span>

      <div className="ms-auto d-flex align-items-center">
        <span className="text-white me-3">
          Welcome, <strong>{user}</strong>
        </span>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;