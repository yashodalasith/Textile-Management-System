import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert

function AdminDashboard() {
  const navigate = useNavigate();

  // Snackbar state
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const logoutHandler = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Show Snackbar alert
    setMessage("Logged out successfully!");
    setSeverity("success");
    setOpen(true);

    // Redirect to the login page after delay
    setTimeout(() => {
      navigate("/"); // Change this path as per your routing logic
    }, 3000); // Delay to match Snackbar duration
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/"); // Redirect if not admin
    }
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Only accessible by admins</p>
      <button type="button" className="btn logout" onClick={logoutHandler}>
        Logout
      </button>

      {/* Snackbar for logout message */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AdminDashboard;
