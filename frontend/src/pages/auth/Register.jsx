import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const validate = (form) => {
  const errors = {};
  if (form.name.length < 20) errors.name = "Name must be at least 20 characters";
  if (form.name.length > 60) errors.name = "Name must be at most 60 characters";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address";
  if (form.password.length < 8 || form.password.length > 16) errors.password = "Password must be 8–16 characters";
  if (!/[A-Z]/.test(form.password)) errors.password = "Password must include at least one uppercase letter";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) errors.password = "Password must include at least one special character";
  if (form.address.length > 400) errors.address = "Address must be at most 400 characters";
  return errors;
};

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", address: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await registerUser(formData);
      toast.success("Account created! Please sign in.");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-title">Rate<span>Store</span></div>
          <div className="auth-logo-sub">Create your account</div>
        </div>
        <div className="auth-card">
          <h2>Create Account</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Full Name <span style={{color:'#64748b'}}>(20–60 chars)</span></label>
              <input className={`input${errors.name ? " error" : ""}`} type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
              {errors.name && <span className="input-error">{errors.name}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input className={`input${errors.email ? " error" : ""}`} type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
              {errors.email && <span className="input-error">{errors.email}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Password <span style={{color:'#64748b'}}>(8–16 chars, 1 uppercase, 1 special)</span></label>
              <input className={`input${errors.password ? " error" : ""}`} type="password" name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} required />
              {errors.password && <span className="input-error">{errors.password}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Address <span style={{color:'#64748b'}}>(max 400 chars)</span></label>
              <input className={`input${errors.address ? " error" : ""}`} type="text" name="address" placeholder="Your address" value={formData.address} onChange={handleChange} />
              {errors.address && <span className="input-error">{errors.address}</span>}
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <div className="auth-link">
            Already have an account? <Link to="/">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;