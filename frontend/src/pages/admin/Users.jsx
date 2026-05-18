import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, addUser } from "../../services/adminService";
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

function AddUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "", role: "user" });
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
      await addUser(form);
      toast.success("User added successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Add New User</span>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label className="input-label">Full Name (20-60 chars)</label>
              <input className={`input${errors.name ? " error" : ""}`} type="text" name="name" placeholder="Enter full name" value={form.name} onChange={handleChange} />
              {errors.name && <span className="input-error">{errors.name}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input className={`input${errors.email ? " error" : ""}`} type="email" name="email" placeholder="user@example.com" value={form.email} onChange={handleChange} />
              {errors.email && <span className="input-error">{errors.email}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Address (max 400 chars)</label>
              <input className={`input${errors.address ? " error" : ""}`} type="text" name="address" placeholder="Enter address" value={form.address} onChange={handleChange} />
              {errors.address && <span className="input-error">{errors.address}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Password (8-16, 1 upper, 1 special)</label>
              <input className={`input${errors.password ? " error" : ""}`} type="password" name="password" placeholder="Create password" value={form.password} onChange={handleChange} />
              {errors.password && <span className="input-error">{errors.password}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Role</label>
              <select className="input" name="role" value={form.role} onChange={handleChange}>
                <option value="user">Normal User</option>
                <option value="owner">Owner</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Adding..." : "Add User"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const ROLE_COLORS = { admin: "badge-admin", user: "badge-user", owner: "badge-owner" };

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getAllUsers(params);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    const params = {};
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    fetchUsers(params);
  };

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate("/admin")} style={{ marginBottom: 12 }}>
              <Icon name="arrow-left" /> Dashboard
            </button>
            <div className="page-title">All Users</div>
            <div className="page-subtitle">Manage registered users on the platform</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Icon name="user-plus" /> Add User
          </button>
        </div>

        <div className="filters">
          {[
            { name: "name", placeholder: "Filter by Name" },
            { name: "email", placeholder: "Filter by Email" },
            { name: "address", placeholder: "Filter by Address" },
          ].map((f) => (
            <input key={f.name} className="input" name={f.name} placeholder={f.placeholder} value={filters[f.name]} onChange={handleFilterChange} style={{ width: 200 }} />
          ))}
          <select className="input" name="role" value={filters.role} onChange={handleFilterChange} style={{ width: 160 }}>
            <option value="">All Roles</option>
            <option value="user">Normal User</option>
            <option value="admin">Admin</option>
            <option value="owner">Store Owner</option>
          </select>
        </div>

        {loading ? <div className="spinner" /> : users.length === 0 ? (
          <div className="empty-state"><div className="empty-icon"><Icon name="users" /></div><p>No users found</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Email</th><th>Address</th><th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id}>
                    <td style={{ color: "var(--text3)" }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: "var(--text2)" }}>{u.email}</td>
                    <td style={{ color: "var(--text2)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.address || "-"}</td>
                    <td><span className={`badge ${ROLE_COLORS[u.role] || "badge-user"}`}>{u.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && <AddUserModal onClose={() => setShowModal(false)} onSuccess={() => fetchUsers()} />}
    </div>
  );
}

export default Users;
