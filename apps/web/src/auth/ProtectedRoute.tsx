import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
