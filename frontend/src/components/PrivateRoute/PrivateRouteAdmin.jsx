import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function AdminPrivateRoute() {
  const role = localStorage.getItem("role"); // Get the role from local storage

  // Check if the role is 'admin'
  return role === "admin" ? <Outlet /> : <Navigate to="/userProfile" />;
}
