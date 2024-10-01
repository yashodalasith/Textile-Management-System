import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const currentCustomer = localStorage.getItem("userId"); // Replace with the actual key used in local storage

  return currentCustomer ? <Outlet /> : <Navigate to="/" />;
}
