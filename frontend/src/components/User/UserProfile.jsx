import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert
import "./Profile.css";

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

  return (
    <div className="prof-form-container">
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
