import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="row">
        <div className="col-md-3">
          <div className="card-box">
            <h5>Total Warehouses</h5>
            <h3>10</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card-box">
            <h5>Total Products</h5>
            <h3>50</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;