import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function PublicOnly() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // or loader
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
