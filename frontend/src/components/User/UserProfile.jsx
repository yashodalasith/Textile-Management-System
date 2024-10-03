import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert
import "./Profile.css";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import { FaDownload } from "react-icons/fa";

import api from "../../services/api";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // Snackbar state
  const [message, setMessage] = useState(""); // Snackbar message
  const [severity, setSeverity] = useState("success"); // Snackbar severity
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserDetails() {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      try {
        const response = await api.post("/userProfile", { token });
        if (response.data.status === "ok") {
          setUser(response.data.user);
        } else {
          console.error("Error retrieving user details", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving user details:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUserDetails();
  }, []);

  const deleteHandler = async () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (userConfirmed) {
      try {
        await api.delete(`/user/${user._id}`);
        setMessage("Account details deleted successfully!");
        setSeverity("success");
        setOpen(true);
        setTimeout(() => {
          navigate("/"); // Redirect after delay
        }, 3000); // Match Snackbar duration
      } catch (error) {
        setMessage("Error deleting account details.");
        setSeverity("error");
        setOpen(true);
      }
    }
  };

  const logoutHandler = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    // Show Snackbar alert
    setMessage("Logged out successfully!");
    setSeverity("success");
    setOpen(true);

    // Redirect to the login page after delay
    setTimeout(() => {
      navigate("/"); // Redirect after delay
    }, 3000); // Match Snackbar duration
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // Function to download the membership card as a PDF
  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape", // Set to landscape for card-like design
      unit: "pt", // Points for precise layout control
      format: [250, 400], // Set custom size to represent a card
    });

    // Add background color
    doc.setFillColor(230, 230, 250); // Light lavender background
    doc.rect(0, 0, 400, 250, "F"); // Draw rectangle filled with color

    // Add border
    doc.setDrawColor(0, 0, 0); // Black border
    doc.rect(10, 10, 380, 230); // Draw border within margins

    // Add "Membership Card" title (centered and bold)
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold"); // Bold font
    doc.setTextColor(54, 69, 79); // Dark slate gray color
    doc.text("Membership Card", 200, 40, null, null, "center"); // Centered text

    // Add "Thank you" message
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal"); // Normal font for the rest
    doc.setTextColor(0, 102, 204); // Blue color
    doc.text(
      "Thank you for becoming our valued member!",
      200,
      70,
      null,
      null,
      "center"
    );

    // Add user details
    doc.setFontSize(12);
    doc.setTextColor(54, 69, 79);
    doc.text(`Name: ${user?.name || "N/A"}`, 70, 110);
    doc.text(`Email: ${user?.email || "N/A"}`, 70, 130);
    doc.text(`Phone: ${user?.phone || "N/A"}`, 70, 150);
    doc.text(`Address: ${user?.address || "N/A"}`, 70, 170);

    // Footer message (centered)
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128); // Gray color
    doc.text(
      "We are excited to have you with us!",
      200,
      210,
      null,
      null,
      "center"
    ); // Centered text

    // Save the PDF as "membership-card.pdf"
    doc.save("membership-card.pdf");
  };

  return (
    <div
      className="prof-form-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full screen height for centering
        backgroundColor: "#f7f7f7", // Light background color for contrast
        position: "relative", // Needed for positioning the download icon
      }}
    >
      {/* Download Icon */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          cursor: "pointer",
        }}
      >
        <FaDownload size={24} onClick={downloadPDF} />
      </div>

      <form
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "400px", // Fixed width for the form
          textAlign: "center",
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "24px",
            color: "#333",
            marginBottom: "20px",
          }}
        >
          Welcome Back😊
          <h3
            className="user-name"
            style={{
              fontSize: "20px",
              color: "#555",
              marginBottom: "30px",
            }}
          >
            {user ? user.name : ""}
          </h3>
        </h2>

        {/* Circle with user's initial */}
        <div
          className="circle"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#4A90E2",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "36px",
            fontWeight: "bold",
            margin: "0 auto 30px", // Centered and with margin
          }}
        >
          {user ? user.name.charAt(0).toUpperCase() : ""}
        </div>

        {/* User Details Table */}
        <div className="user-details" style={{ marginBottom: "20px" }}>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ textAlign: "left", paddingBottom: "10px" }}>
                  Name:
                </td>
                <td>{user ? user.name : ""}</td>
              </tr>
              <tr>
                <td style={{ textAlign: "left", paddingBottom: "10px" }}>
                  Email:
                </td>
                <td>{user ? user.email : ""}</td>
              </tr>
              <tr>
                <td style={{ textAlign: "left", paddingBottom: "10px" }}>
                  Phone:
                </td>
                <td>{user ? user.phone : ""}</td>
              </tr>
              <tr>
                <td style={{ textAlign: "left", paddingBottom: "10px" }}>
                  Address:
                </td>
                <td>{user ? user.address : ""}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div
          className="actions"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <button
            className="btn update"
            style={{
              width: "150px",
              padding: "10px",
              backgroundColor: "#4A90E2",
              color: "#fff",
              borderRadius: "5px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            {user && (
              <Link
                to={`/updateProfile/${user._id}`}
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Update
              </Link>
            )}
          </button>

          <button
            type="button"
            className="btn delete"
            onClick={deleteHandler}
            style={{
              width: "150px",
              padding: "10px",
              backgroundColor: "#E74C3C",
              color: "#fff",
              borderRadius: "5px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Delete
          </button>
        </div>

        <button
          type="button"
          className="btn logout"
          onClick={logoutHandler}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#333",
            color: "#fff",
            borderRadius: "5px",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Logout
        </button>
      </form>

      {/* Snackbar component */}
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

export default UserProfile;
