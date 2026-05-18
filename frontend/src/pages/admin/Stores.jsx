import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStores, addStore } from "../../services/adminService";
import Navbar from "../../components/Navbar";
import Icon from "../../components/Icon";
import toast from "react-hot-toast";

const validateStoreForm = (f) => {
  const errs = {};
  if (!f.name.trim()) errs.name = "Store name is required";
  if (!f.address.trim()) errs.address = "Address is required";
  if (f.address.length > 400) errs.address = "Address must be at most 400 characters";
  if (!f.ownerEmail.trim()) errs.ownerEmail = "Owner email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.ownerEmail)) errs.ownerEmail = "Enter a valid email address";
  return errs;
};

function AddStoreModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", address: "", description: "", ownerEmail: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStoreForm(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await addStore(form);
      toast.success("Store added successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Add New Store</span>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {[
              { label: "Store Name", name: "name", type: "text", placeholder: "e.g. Pizza Palace" },
              { label: "Store Address (max 400 chars)", name: "address", type: "text", placeholder: "123 Main St, City" },
              { label: "Description (optional)", name: "description", type: "text", placeholder: "Brief description..." },
              { label: "Owner Email (must be an existing owner)", name: "ownerEmail", type: "email", placeholder: "owner@example.com" },
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
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Adding..." : "Add Store"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StarDisplay({ value }) {
  const num = parseFloat(value) || 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Icon key={s} name="star" style={s <= Math.round(num) ? { fontSize: 14, color: "var(--star)" } : { fontSize: 14, color: "var(--bg3)" }} />
      ))}
      {value ? <span style={{ fontSize: 13, color: "var(--text2)", marginLeft: 2 }}>{num}</span> : <span style={{ fontSize: 13, color: "var(--text3)" }}>No ratings</span>}
    </div>
  );
}

function Stores() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getAllStores(params);
      setStores(res.data);
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
    fetchStores(params);
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
            <div className="page-title">All Stores</div>
            <div className="page-subtitle">Manage registered stores on the platform</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Icon name="plus" /> Add Store
          </button>
        </div>

        <div className="filters">
          {[
            { name: "name", placeholder: "Filter by Store Name" },
            { name: "email", placeholder: "Filter by Owner Email" },
            { name: "address", placeholder: "Filter by Address" },
          ].map((f) => (
            <input key={f.name} className="input" name={f.name} placeholder={f.placeholder} value={filters[f.name]} onChange={handleFilterChange} style={{ width: 220 }} />
          ))}
        </div>

        {loading ? <div className="spinner" /> : stores.length === 0 ? (
          <div className="empty-state"><div className="empty-icon"><Icon name="store" /></div><p>No stores found</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Address</th><th>Description</th><th>Avg Rating</th></tr>
              </thead>
              <tbody>
                {stores.map((s, i) => (
                  <tr key={s.id}>
                    <td style={{ color: "var(--text3)" }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td style={{ color: "var(--text2)" }}>{s.address}</td>
                    <td style={{ color: "var(--text3)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.description || "-"}</td>
                    <td><StarDisplay value={s.averageRating} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && <AddStoreModal onClose={() => setShowModal(false)} onSuccess={() => fetchStores()} />}
    </div>
  );
}

export default Stores;
