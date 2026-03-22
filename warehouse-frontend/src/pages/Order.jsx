import { useEffect, useState } from "react";
import { getOrders } from "../api/orderApi";
import "./Order.css";

function Order() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getOrders().then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="orders">
      <h2>Orders</h2>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Order No</th>
            <th>Customer</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((o) => (
            <tr key={o.id}>
              <td>{o.order_number}</td>
              <td>{o.customer_name}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Order;