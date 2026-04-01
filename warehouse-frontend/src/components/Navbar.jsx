import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import API from "../api/axios";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const cachedName = localStorage.getItem("user_name");
    return cachedName ? { full_name: cachedName, email: "" } : null;
  });
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const getName = (obj) =>
    obj?.full_name || obj?.name || obj?.username || "";

  useEffect(() => {
    const cachedName = localStorage.getItem("user_name");

    API.get("accounts/profile/")
      .then((r) => {
        const apiName = getName(r.data) || cachedName || "User";
        localStorage.setItem("user_name", apiName);
        setUser({ ...r.data, full_name: apiName });
      })
      .catch(() => setUser({ full_name: cachedName || "User", email: "" }));
  }, []);

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const name     = user?.full_name || "User";
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <span className="navbar-icon">🏭</span>
        <div>
          <p className="navbar-title">Warehouse Management</p>
          <p className="navbar-sub">Operations Dashboard</p>
        </div>
      </div>

      {/* User */}
      <div className="navbar-user" ref={ref}>
        <p className="navbar-greeting">
          <span className="navbar-greeting-label">User</span>
          <strong>{name}</strong>
        </p>
        <button className="navbar-avatar" onClick={() => setOpen(o => !o)}>
          {initials}
        </button>

        {open && (
          <div className="navbar-dropdown">
            <div className="navbar-dropdown-user">
              <div className="navbar-dropdown-avatar">{initials}</div>
              <div>
                <p className="navbar-dropdown-name">{name}</p>
                <p className="navbar-dropdown-email">{user?.email || ""}</p>
              </div>
            </div>
            <hr className="navbar-dropdown-hr" />
            <button className="navbar-signout" onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user_name"); navigate("/"); }}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}