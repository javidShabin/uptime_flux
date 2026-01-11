import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Monitors from "../pages/dashboard/Monitors";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import Landing from "../pages/Landing";
import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Incidents from "../pages/dashboard/Incidents";
import Otp from "../pages/Otp";

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <Landing />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />
      <Route
        path="/register"
        element={
          <PublicLayout>
            <Register />
          </PublicLayout>
        }
      />

      <Route
        path="/otp"
        element={
          <PublicLayout>
            <Otp />
          </PublicLayout>
        }
      />

      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="monitors" element={<Monitors />} />
          <Route path="incidents" element={<Incidents />} />
        </Route>
      </Route>
    </Routes>
  );
}
