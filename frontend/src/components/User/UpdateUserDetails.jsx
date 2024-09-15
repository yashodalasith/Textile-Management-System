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
    <div className="prof-form-container">
      <form onSubmit={handleSubmit}>
        <h2>
          Update Details<i className="fa-regular fa-pen-to-square"></i>{" "}
          <h3 className="user-name">{user ? user.name : ""}</h3>
        </h2>
        <div className="circle">
          {user ? user.name.charAt(0).toUpperCase() : ""}
        </div>
        <div className="user-details">
          <table>
            <tbody>
              <tr>
                <td>Name:</td>
                <td>
                  <input
                    type="text"
                    value={user.name}
                    name="name"
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>
                  <input
                    type="email"
                    value={user.email}
                    name="email"
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Phone:</td>
                <td>
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Address:</td>
                <td>
                  <input
                    type="text"
                    name="address"
                    value={user.address}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="actions">
          <button type="submit" className="btn update">
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
