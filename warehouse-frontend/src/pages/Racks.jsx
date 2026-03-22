import React, { useEffect, useState } from "react";
import { getRacks, deleteRack } from "../api/warehouseApi";

function Racks() {
  const [racks, setRacks] = useState([]);

  // Load racks on page load
  useEffect(() => {
    fetchRacks();
  }, []);

  const fetchRacks = async () => {
    try {
      const response = await getRacks();
      setRacks(response.data);
    } catch (error) {
      console.error("Error fetching racks:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRack(id);
      fetchRacks(); // refresh after delete
    } catch (error) {
      console.error("Error deleting rack:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Racks</h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Zone</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {racks.length > 0 ? (
            racks.map((rack) => (
              <tr key={rack.id}>
                <td>{rack.id}</td>
                <td>{rack.name}</td>
                <td>{rack.zone}</td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(rack.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No racks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Racks;