import React, { useEffect, useState } from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";

import api from "../../services/api";

function UpdateUserProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const { id } = useParams();
  const navigate = useNavigate(); // For navigation after successful update

  // Snackbar state
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await api.get(`/user/${id}`);
        setUser(response.data.user);
      } catch (error) {
        setMessage("Error fetching user details");
        setSeverity("error");
        setOpen(true);
        console.error("Error fetching user details:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    try {
      await api.put(`/user/${id}`, user);
    } catch (error) {
      setMessage("Error updating user details");
      setSeverity("error");
      setOpen(true);
      console.error("Error updating user:", error);
    }
  };

  const handleInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendRequest().then(() => {
      setMessage("Updated successfully!");
      setSeverity("success");
      setOpen(true);

      // Delay navigation to show Snackbar
      setTimeout(() => {
        navigate("/userprofile");
      }, 3000); // Matches Snackbar duration
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
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
      }}
    >
      <form
        onSubmit={handleSubmit}
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
            marginBottom: "20px",
            fontSize: "28px",
            color: "#333",
          }}
        >
          Update Details <i className="fa-regular fa-pen-to-square"></i>
        </h2>

        {/* User's Name */}
        <h3
          className="user-name"
          style={{ fontSize: "20px", marginBottom: "20px", color: "#555" }}
        >
          {user ? user.name : ""}
        </h3>

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
        <div className="user-details">
          <table style={{ width: "100%", marginBottom: "20px" }}>
            <tbody>
              {/* Name */}
              <tr>
                <td style={{ textAlign: "left", paddingBottom: "10px" }}>
                  Name:
                </td>
                <td>
                  <input
                    type="text"
                    value={user.name}
                    name="name"
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                </td>
              </tr>

              {/* Email */}
              <tr>
                <td style={{ textAlign: "left", paddingBottom: "10px" }}>
                  Email:
                </td>
                <td>
                  <input
                    type="email"
                    value={user.email}
                    name="email"
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                </td>
              </tr>

              {/* Phone */}
              <tr>
                <td style={{ textAlign: "left", paddingBottom: "10px" }}>
                  Phone:
                </td>
                <td>
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                </td>
              </tr>

              {/* Address */}
              <tr>
                <td style={{ textAlign: "left", paddingBottom: "10px" }}>
                  Address:
                </td>
                <td>
                  <input
                    type="text"
                    name="address"
                    value={user.address}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Update Button */}
        <div className="actions">
          <button
            type="submit"
            className="btn update"
            style={{
              width: "100%",
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
            Update
          </button>
        </div>
      </form>

      {/* Snackbar for feedback messages */}
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

export default UpdateUserProfile;
