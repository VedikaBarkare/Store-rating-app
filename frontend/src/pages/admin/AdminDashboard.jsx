import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardData, addUser } from "../../services/adminService";
import Navbar from "../../components/Navbar";
import Icon from "../../components/Icon";
import toast from "react-hot-toast";

const validateForm = (f) => {
  const errs = {};
  if (f.name.length < 20) errs.name = "Name must be at least 20 characters";
  if (f.name.length > 60) errs.name = "Name must be at most 60 characters";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.email = "Enter a valid email address";
  if (f.password.length < 8 || f.password.length > 16) errs.password = "Password must be 8-16 characters";
  if (!/[A-Z]/.test(f.password)) errs.password = "Must include at least one uppercase letter";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(f.password)) errs.password = "Must include at least one special character";
  if (f.address.length > 400) errs.address = "Address must be at most 400 characters";
  return errs;
};

function AddAdminModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await addUser({ ...form, role: "admin" });
      toast.success("Admin added successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Add New Admin</span>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {[
              { label: "Full Name (20-60 chars)", name: "name", type: "text", placeholder: "Enter full name" },
              { label: "Email Address", name: "email", type: "email", placeholder: "admin@example.com" },
              { label: "Address (max 400 chars)", name: "address", type: "text", placeholder: "Enter address" },
              { label: "Password (8-16, 1 upper, 1 special)", name: "password", type: "password", placeholder: "Create password" },
            ].map((f) => (
              <div className="input-group" key={f.name}>
                <label className="input-label">{f.label}</label>
                <input className={`input${errors[f.name] ? " error" : ""}`} type={f.type} name={f.name} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} />
                {errors[f.name] && <span className="input-error">{errors[f.name]}</span>}
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Adding..." : "Add Admin"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ users: 0, stores: 0, ratings: 0 });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getDashboardData();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Total Users", value: data.users, icon: "users", color: "purple", path: "/admin/users" },
    { label: "Total Stores", value: data.stores, icon: "store", color: "cyan", path: "/admin/stores" },
    { label: "Total Ratings", value: data.ratings, icon: "star", color: "amber", path: null },
  ];

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <div>
            <div className="page-title">Admin Dashboard</div>
            <div className="page-subtitle">Overview of your platform</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Icon name="plus" /> Add Admin
          </button>
        </div>

        {loading ? <div className="spinner" /> : (
          <div className="stat-cards">
            {stats.map((s) => (
              <div key={s.label} className={`stat-card ${s.color}`} onClick={() => s.path && navigate(s.path)}>
                <div className="stat-icon"><Icon name={s.icon} /></div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                {s.path && <div style={{ fontSize: 12, color: "var(--primary-light)", marginTop: 4 }}>Click to view <Icon name="arrow-right" /></div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <AddAdminModal onClose={() => setShowModal(false)} onSuccess={fetchData} />}
    </div>
  );
}

export default AdminDashboard;
