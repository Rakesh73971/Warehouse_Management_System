import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import API from "../api/axios";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    API.get("accounts/profile/")
      .then(r => setUser(r.data))
      .catch(() => setUser({ full_name: "User", email: "" }));
  }, []);

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const name     = user?.full_name || "User";
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const greeting = ["morning","morning","morning","morning","morning","morning",
                    "morning","morning","morning","morning","morning","morning",
                    "afternoon","afternoon","afternoon","afternoon","afternoon",
                    "evening","evening","evening","evening","evening","evening","evening"]
                   [new Date().getHours()];

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
        <p className="navbar-greeting">Good {greeting}, <strong>{name}</strong></p>
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
            <button className="navbar-signout" onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}