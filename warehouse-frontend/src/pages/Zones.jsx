import { useEffect, useState } from "react";
import { getZones } from "../api/warehouseApi";
import "./Zones.css";

function Zones() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    getZones().then((res) => {
      setZones(res.data);
    });
  }, []);

  return (
    <div className="zones">
      <h2>Zones</h2>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Warehouse</th>
            <th>Name</th>
            <th>Description</th>
            <th>Storage Type</th>
          </tr>
        </thead>

        <tbody>
          {zones.map((z) => (
            <tr key={z.id}>
              <td>{z.warehouse}</td>
              <td>{z.name}</td>
              <td>{z.description}</td>
              <td>{z.storage_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Zones;