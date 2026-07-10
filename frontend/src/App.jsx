import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import AccessDenied from "./pages/AccessDenied";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Protected Staff Routes (accessible by STAFF or ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={["STAFF", "ADMIN"]} />}>
        <Route path="/staff" element={<StaffDashboard />} />
      </Route>

      {/* Protected Customer Routes (accessible by CUSTOMER, STAFF, or ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={["CUSTOMER", "STAFF", "ADMIN"]} />}>
        <Route path="/customer" element={<CustomerDashboard />} />
      </Route>

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;