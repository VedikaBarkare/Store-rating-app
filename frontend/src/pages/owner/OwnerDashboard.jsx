import { useEffect, useState } from "react";
import { getOwnerStores } from "../../services/storeService";
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

function StarDisplay({ value }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <Icon key={s} name="star" className={`star star-sm ${s <= Math.round(value || 0) ? "filled" : ""}`} />
      ))}
    </div>
  );
}

function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await getOwnerStores();
      setStores(res.data.stores || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
    if (pwErrors[e.target.name]) setPwErrors({ ...pwErrors, [e.target.name]: "" });
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwForm.currentPassword) errs.currentPassword = "Required";
    const err = validatePassword(pwForm.newPassword);
    if (err) errs.newPassword = err;
    if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length) {
      setPwErrors(errs);
      return;
    }

    setPwLoading(true);
    try {
      await updatePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success("Password updated!");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <div>
            <div className="page-title">Owner Dashboard</div>
            <div className="page-subtitle">Manage your store and view ratings</div>
          </div>
        </div>

        {loading ? <div className="spinner" /> : stores.length === 0 ? (
          <div className="empty-state"><div className="empty-icon"><Icon name="store" /></div><p>No stores assigned to your account</p></div>
        ) : stores.map((store) => (
          <div key={store.id} style={{ marginBottom: 32 }}>
            <div className="owner-header">
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{store.name}</div>
                <div style={{ color: "var(--text2)", fontSize: 14 }}><Icon name="location-dot" className="inline-icon muted-icon" /> {store.address}</div>
                {store.description && <div style={{ color: "var(--text3)", fontSize: 13, marginTop: 6 }}>{store.description}</div>}
              </div>
              <div className="owner-avg">
                <div className="owner-avg-number">{store.averageRating || "-"}</div>
                <div>
                  <StarDisplay value={store.averageRating || 0} />
                  <div className="owner-avg-label" style={{ marginTop: 6 }}>
                    {store.raters?.length || 0} rating{(store.raters?.length || 0) !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="section-title"><Icon name="users" className="section-icon" /> Users Who Rated Your Store</div>
            {(store.raters || []).length === 0 ? (
              <div className="empty-state" style={{ padding: "32px 20px" }}>
                <div className="empty-icon"><Icon name="star" /></div>
                <p>No ratings submitted yet</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.raters.map((r, i) => (
                      <tr key={r.userId}>
                        <td style={{ color: "var(--text3)" }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{r.name}</td>
                        <td style={{ color: "var(--text2)" }}>{r.email}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <StarDisplay value={r.rating} />
                            <span style={{ color: "var(--star)", fontWeight: 700 }}>{r.rating}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        <div className="card" style={{ maxWidth: 520, marginTop: 8 }}>
          <div className="section-title"><Icon name="lock" className="section-icon" /> Change Password</div>
          <form onSubmit={handlePwSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Current Password</label>
              <input className={`input${pwErrors.currentPassword ? " error" : ""}`} type="password" name="currentPassword" placeholder="Current password" value={pwForm.currentPassword} onChange={handlePwChange} />
              {pwErrors.currentPassword && <span className="input-error">{pwErrors.currentPassword}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">New Password</label>
              <input className={`input${pwErrors.newPassword ? " error" : ""}`} type="password" name="newPassword" placeholder="New password (8-16 chars, 1 uppercase, 1 special)" value={pwForm.newPassword} onChange={handlePwChange} />
              {pwErrors.newPassword && <span className="input-error">{pwErrors.newPassword}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Confirm New Password</label>
              <input className={`input${pwErrors.confirmPassword ? " error" : ""}`} type="password" name="confirmPassword" placeholder="Confirm new password" value={pwForm.confirmPassword} onChange={handlePwChange} />
              {pwErrors.confirmPassword && <span className="input-error">{pwErrors.confirmPassword}</span>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={pwLoading} style={{ alignSelf: "flex-start" }}>
              {pwLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
