import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout";

import Dashboard from "./pages/Dashboard";
import Warehouses from "./pages/Warehouses";
import Zones from "./pages/Zones";
import Racks from "./pages/Racks";
import Bins from "./pages/Bins";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Order";
import Login from "./pages/Login";
import Register from "./pages/Register";

// 🔐 Protected Route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth Pages */}
        <Route path="/" element={<Login />} />
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
          {/* Default redirect */}
          <Route index element={<Navigate to="dashboard" />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="warehouses" element={<Warehouses />} />
          <Route path="zones" element={<Zones />} />
          <Route path="racks" element={<Racks />} />
          <Route path="bins" element={<Bins />} />
          <Route path="products" element={<Products />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<h2>Page Not Found</h2>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;