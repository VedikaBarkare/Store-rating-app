import { useState } from "react";
import { loginUser } from "../../services/authService";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Welcome back!");
      const role = res.data.user.role;
      if (role === "admin") navigate("/admin");
      else if (role === "owner") navigate("/owner");
      else navigate("/stores");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-title">Rate<span>Store</span></div>
          <div className="auth-logo-sub">Rate the stores you love</div>
        </div>
        <div className="auth-card">
          <h2>Sign In</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                className="input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                className="input"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="auth-link">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;