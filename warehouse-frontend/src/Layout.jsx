import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="layout-body">
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;