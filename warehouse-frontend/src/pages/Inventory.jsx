import { useEffect, useState } from "react";
import { getInventory } from "../api/inventoryApi";
import "./Inventory.css";

function Inventory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getInventory().then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="inventory">
      <h2>Inventory</h2>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Product</th>
            <th>Bin</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>
          {data.map((i) => (
            <tr key={i.id}>
              <td>{i.product}</td>
              <td>{i.bin}</td>
              <td>{i.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;