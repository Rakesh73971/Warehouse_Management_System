import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import "./Login.css";


function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    full_name: "",
    password: "",
    role: "STAFF",
  });

  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await API.post("/accounts/register/", form);

      alert("Registered Successfully ✅");
      navigate("/");

    } catch (err) {
      console.error(err);
      setError("Registration Failed ❌");
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <h3>Register</h3>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) =>
            setForm({ ...form, full_name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Optional Role */}
        <select
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="STAFF">Staff</option>
          <option value="MANAGER">Manager</option>
        </select>

        <button onClick={handleRegister}>Register</button>

        <p>
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;