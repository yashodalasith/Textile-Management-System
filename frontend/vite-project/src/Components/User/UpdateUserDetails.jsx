import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";

const apiUrl = import.meta.env.VITE_API_URL;
Modal.setAppElement("#root"); // Be sure to bind modal to your app element

function UpdateUserProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/${id}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    try {
      await axios.put(`${apiUrl}/user/${id}`, user);
    } catch (error) {
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
      window.alert("Updated successfully!");
      window.location.href = "/userprofile";
    });
  };

  return (
    <div className="prof-form-container">
      <form onSubmit={handleSubmit}>
        <h2>
          Update Details<i class="fa-regular fa-pen-to-square"></i>{" "}
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
    </div>
  );
}

export default UpdateUserProfile;
