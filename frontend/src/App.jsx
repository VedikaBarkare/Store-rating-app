import "./App.css";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Stores from "./pages/admin/Stores";
import UserDashboard from "./pages/user/UserDashboard";
import StoreDetail from "./pages/user/StoreDetail";
import UserProfile from "./pages/user/UserProfile";
import OwnerDashboard from "./pages/owner/OwnerDashboard";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; } })();
  if (!token) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(255, 250, 242, 0.96)",
            color: "#201913",
            border: "1px solid rgba(72, 52, 40, 0.12)",
            boxShadow: "0 16px 34px rgba(55, 34, 21, 0.12)",
            fontFamily: "Manrope, sans-serif",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#2f7d55", secondary: "#fffaf2" } },
          error: { iconTheme: { primary: "#b0413e", secondary: "#fffaf2" } },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><Users /></ProtectedRoute>} />
        <Route path="/admin/stores" element={<ProtectedRoute role="admin"><Stores /></ProtectedRoute>} />

        {/* User routes */}
        <Route path="/stores" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/stores/:id" element={<ProtectedRoute role="user"><StoreDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute role="user"><UserProfile /></ProtectedRoute>} />

        {/* Owner routes */}
        <Route path="/owner" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/profile" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
