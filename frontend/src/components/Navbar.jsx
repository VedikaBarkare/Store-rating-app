import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "./Icon";

function Navbar({ title = "RateStore" }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; }
  })();

  const initials = user.name ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "U";

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const roleLabel = { admin: "Administrator", owner: "Store Owner", user: "User" };

  return (
    <nav className="navbar">
      <Link to="#" className="navbar-brand">
        Rate<span>Store</span>
      </Link>
      <div className="navbar-right" ref={ref}>
        <div className="dropdown">
          <div className="navbar-avatar" onClick={() => setOpen(!open)}>{initials}</div>
          {open && (
            <div className="dropdown-menu">
              <div className="dropdown-label">{roleLabel[user.role] || "User"}</div>
              <div className="dropdown-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: 2, cursor: "default" }}>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>{user.name}</span>
                <span style={{ fontSize: 12, color: "var(--text3)" }}>{user.email}</span>
              </div>
              <hr className="dropdown-divider" />
              {user.role === "user" && (
                <div className="dropdown-item" onClick={() => { setOpen(false); navigate("/profile"); }}>
                  <Icon name="user" className="menu-icon" /> My Account
                </div>
              )}
              {user.role === "owner" && (
                <div className="dropdown-item" onClick={() => { setOpen(false); navigate("/owner/profile"); }}>
                  <Icon name="user" className="menu-icon" /> My Account
                </div>
              )}
              {user.role === "admin" && (
                <div className="dropdown-item" onClick={() => { setOpen(false); navigate("/admin"); }}>
                  <Icon name="table-columns" className="menu-icon" /> Dashboard
                </div>
              )}
              <hr className="dropdown-divider" />
              <div className="dropdown-item" style={{ color: "var(--danger)" }} onClick={logout}>
                <Icon name="right-from-bracket" className="menu-icon" /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
