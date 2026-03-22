import { useEffect, useState } from "react";
import { getBins } from "../api/warehouseApi";
import "./Bins.css";

function Bins() {
  const [bins, setBins] = useState([]);

  useEffect(() => {
    getBins().then((res) => {
      setBins(res.data);
    });
  }, []);

  return (
    <div className="bins">
      <h2>Bins</h2>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Rack</th>
            <th>Bin Code</th>
            <th>Max Capacity</th>
            <th>Current Capacity</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {bins.map((b) => (
            <tr key={b.id}>
              <td>{b.rack}</td>
              <td>{b.bin_code}</td>
              <td>{b.max_capacity}</td>
              <td>{b.current_capacity}</td>
              <td>
                {b.is_available ? (
                  <span className="badge bg-success">Available</span>
                ) : (
                  <span className="badge bg-danger">Full</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Bins;