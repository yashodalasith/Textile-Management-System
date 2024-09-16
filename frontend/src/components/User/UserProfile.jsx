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
    <div className="prof-form-container">
      {/* Download Icon */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          cursor: "pointer",
        }}
      >
        <FaDownload size={24} onClick={downloadPDF} />
      </div>

      <form>
        <h2 style={{ fontWeight: "bold", fontSize: "24px" }}>
          Welcome Back😊 <h3 className="user-name">{user ? user.name : ""}</h3>
        </h2>
        <div className="circle">
          {user ? user.name.charAt(0).toUpperCase() : ""}
        </div>
        <div className="user-details">
          <table>
            <tbody>
              <tr>
                <td>Name:</td>
                <td>{user ? user.name : ""}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{user ? user.email : ""}</td>
              </tr>
              <tr>
                <td>Phone:</td>
                <td>{user ? user.phone : ""}</td>
              </tr>
              <tr>
                <td>Address:</td>
                <td>{user ? user.address : ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="actions flex gap-2" style={{ color: "white" }}>
          <button className="btn update px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
            {user && <Link to={`/updateProfile/${user._id}`}>Update</Link>}
          </button>

          <button
            type="button"
            className="btn delete px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            onClick={deleteHandler}
          >
            Delete
          </button>
        </div>

        <button type="button" className="btn logout" onClick={logoutHandler}>
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
