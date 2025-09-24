// src/components/PrivateRoute/PrivateRouteUser.jsx
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

export default function PrivateRoute() {
  const { accessToken, isAuthReady } = useAuth();
  if (!isAuthReady) return null;          // or a small loader
  return accessToken ? <Outlet /> : <Navigate to="/" replace />;
}
