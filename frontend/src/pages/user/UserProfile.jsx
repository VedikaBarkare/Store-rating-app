import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../../services/authService";
import Navbar from "../../components/Navbar";
import Icon from "../../components/Icon";
import toast from "react-hot-toast";

const validatePassword = (pw) => {
  if (pw.length < 8 || pw.length > 16) return "Password must be 8-16 characters";
  if (!/[A-Z]/.test(pw)) return "Must include at least one uppercase letter";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) return "Must include at least one special character";
  return "";
};

function UserProfile() {
  const navigate = useNavigate();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = "Required";
    const pwErr = validatePassword(form.newPassword);
    if (pwErr) errs.newPassword = pwErr;
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await updatePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success("Password updated successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="page-content" style={{ maxWidth: 640 }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate("/stores")} style={{ marginBottom: 24 }}>
          <Icon name="arrow-left" /> Back to Stores
        </button>
        <div className="page-title" style={{ marginBottom: 24 }}>My Account</div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="section-title"><Icon name="user" className="section-icon" /> Profile Information</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text2)", fontSize: 14 }}>Full Name</span>
              <span style={{ fontWeight: 600 }}>{user.name}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text2)", fontSize: 14 }}>Email</span>
              <span style={{ fontWeight: 600 }}>{user.email}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
              <span style={{ color: "var(--text2)", fontSize: 14 }}>Address</span>
              <span style={{ fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{user.address || "-"}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title"><Icon name="lock" className="section-icon" /> Change Password</div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Current Password</label>
              <input className={`input${errors.currentPassword ? " error" : ""}`} type="password" name="currentPassword" placeholder="Enter current password" value={form.currentPassword} onChange={handleChange} />
              {errors.currentPassword && <span className="input-error">{errors.currentPassword}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">New Password <span style={{ color: "var(--text3)" }}>(8-16 chars, 1 uppercase, 1 special)</span></label>
              <input className={`input${errors.newPassword ? " error" : ""}`} type="password" name="newPassword" placeholder="Enter new password" value={form.newPassword} onChange={handleChange} />
              {errors.newPassword && <span className="input-error">{errors.newPassword}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Confirm New Password</label>
              <input className={`input${errors.confirmPassword ? " error" : ""}`} type="password" name="confirmPassword" placeholder="Confirm new password" value={form.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <span className="input-error">{errors.confirmPassword}</span>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: "flex-start" }}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
