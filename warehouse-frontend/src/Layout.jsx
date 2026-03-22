import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar />

        <div className="p-4 w-100">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;