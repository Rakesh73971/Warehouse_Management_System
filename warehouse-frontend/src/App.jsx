import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Protected Pages */}
        <Route path="/app" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="warehouses" element={<Warehouses />} />
          <Route path="zones" element={<Zones />} />
          <Route path="racks" element={<Racks />} />
          <Route path="bins" element={<Bins />} />
          <Route path="products" element={<Products />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;