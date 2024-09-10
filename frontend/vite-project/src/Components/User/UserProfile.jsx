import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate, Link } from "react-router-dom";
import "./Profile.css";

const apiUrl = import.meta.env.VITE_API_URL;
Modal.setAppElement("#root"); // Be sure to bind modal to your app element

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserDetails() {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      try {
        const response = await axios.post(`${apiUrl}/userProfile`, { token });
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
        await axios.delete(`${apiUrl}/user/${user._id}`);
        window.alert("Account details deleted successfully!");
        navigate("/"); // Change to appropriate route
      } catch (error) {
        console.error("Error deleting account details:", error);
      }
    }
  };
  const logoutHandler = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Optionally show an alert or confirmation
    window.alert("Logged out successfully!");

    // Redirect to the login page
    navigate("/"); // Change this path as per your routing logic
  };

  return (
    <div className="prof-form-container">
      <form>
        <h2>
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
        <div className="actions">
          <button className="btn-update">
            {user && (
              <Link to={`/updateProfile/${user._id}`} className="btn link">
                Update
              </Link>
            )}
          </button>

          <button type="button" className="btn delete" onClick={deleteHandler}>
            Delete
          </button>
        </div>
        <button type="button" className="btn logout" onClick={logoutHandler}>
          Logout
        </button>
      </form>
    </div>
  );
}

export default UserProfile;
