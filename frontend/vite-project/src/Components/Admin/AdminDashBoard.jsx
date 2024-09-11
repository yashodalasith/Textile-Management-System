import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const logoutHandler = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Optionally show an alert or confirmation
    window.alert("Logged out successfully!");

    // Redirect to the login page
    navigate("/"); // Change this path as per your routing logic
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/"); // enter redirect routes
    }
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Only accessible by admins</p>
      <button type="button" className="btn logout" onClick={logoutHandler}>
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;
