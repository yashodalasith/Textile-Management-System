import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function AdminPrivateRoute() {
  const [alertShown, setAlertShown] = useState(false);
  const role = localStorage.getItem("role");
  const location = useLocation();

  useEffect(() => {
    if (role !== "admin" && !alertShown) {
      alert(
        "Unauthorized access! You don't have permission to view this page."
      );
      setAlertShown(true); // Set alert shown to true to prevent duplicate alerts
    }
  }, [role, alertShown]);

  return role === "admin" ? <Outlet /> : <Navigate to="/userProfile" />;
}
