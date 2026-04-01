import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "../components/toast";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const pickUserName = (data) =>
    data?.full_name ||
    data?.name ||
    data?.username ||
    data?.user?.full_name ||
    data?.user?.name ||
    data?.user?.username ||
    "";

  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      const res = await API.post("accounts/login/", form);

      localStorage.setItem("token", res.data.access);
      const loggedInName = pickUserName(res.data);
      if (loggedInName) {
        localStorage.setItem("user_name", loggedInName);
      }

      toast("Login success", "success");

      navigate("/app/dashboard"); // ✅ correct route
    } catch {
      toast("Login failed. Check email/password.", "error");
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <h3>Login</h3>

        {/* ✅ FORM ADDED */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button type="submit">Login</button>
        </form>

        <p>
          Don’t have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;