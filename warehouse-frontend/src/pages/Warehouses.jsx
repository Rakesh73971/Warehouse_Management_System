import { useEffect, useState } from "react";
import { getWarehouses } from "../api/warehouseApi";
import "./Warehouses.css";

function Warehouses() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getWarehouses().then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="warehouse">
      <h2>Warehouses</h2>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Warehouses;