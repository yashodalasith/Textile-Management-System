import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const [alertShown, setAlertShown] = useState(false);
  const currentCustomer = localStorage.getItem("userId");
  const location = useLocation();

  useEffect(() => {
    if (!currentCustomer && !alertShown) {
      alert("You must log in first to access this page.");
      setAlertShown(true); // Set alert shown to true to prevent duplicate alerts
    }
  }, [currentCustomer, alertShown]);

  return currentCustomer ? <Outlet /> : <Navigate to="/" />;
}
