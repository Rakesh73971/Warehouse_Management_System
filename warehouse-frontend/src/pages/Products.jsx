import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";
import "./Products.css";

function Products() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getProducts().then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="products">
      <h2>Products</h2>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
          </tr>
        </thead>

        <tbody>
          {data.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;