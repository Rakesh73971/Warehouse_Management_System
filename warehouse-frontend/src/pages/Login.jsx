import { useState } from "react";
import API from "../api/axios";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    const res = await API.post("/auth/login/", form);
    localStorage.setItem("token", res.data.access);
    alert("Login Success");
  };

  return (
    <div className="login">
      <div className="login-box">
        <h3>Login</h3>

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

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;