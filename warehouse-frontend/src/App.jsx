import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout    from "./Layout";
import Dashboard from "./pages/Dashboard";
import Warehouses from "./pages/Warehouses";  // handles Zones, Racks, Bins via drill-down
import Products  from "./pages/Products";
import Inventory from "./pages/Inventory";
import Orders    from "./pages/Order";
import Login     from "./pages/Login";           // your login file is Log.jsx
import Register  from "./pages/Register";

/* ── Protected Route ── */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route path="/"         element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Layout */}
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="warehouses" element={<Warehouses />} />  {/* Zones/Racks/Bins live inside */}
          <Route path="products"   element={<Products />} />
          <Route path="inventory"  element={<Inventory />} />
          <Route path="orders"     element={<Orders />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h2 style={{ padding: 40, fontFamily: "sans-serif" }}>Page Not Found</h2>} />

      </Routes>
    </BrowserRouter>
  );
}