import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import DashboardLayout from "../layouts/DashboardLayout";
import RequireAuth from "../auth/RequireAuth";
import PublicOnly from "../auth/PublicOnly";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicOnly />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/monitors" element={<div>Monitors</div>} />
          <Route path="/incidents" element={<div>Incidents</div>} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
