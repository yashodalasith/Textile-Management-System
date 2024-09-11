import React, { useState, useRef } from "react";
import axios from "axios";
import "./login.css";

const apiUrl = import.meta.env.VITE_API_URL;

function Login() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const containerRef = useRef(null);

  // Control login
  const [User, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const SendRequest = async () => {
    try {
      const res = await axios.post(`${apiUrl}/login`, {
        email: User.email,
        password: User.password,
      });
      return res.data;
    } catch (error) {
      throw new Error("Login failed!!");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await SendRequest();
      if (response.token) {
        // If exists
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        if (response.role === "admin") {
          window.location.href = "/adminDashboard"; ///redirect to addmin dashboard
          alert("Hello Admin!!");
        } else {
          window.location.href = "/home";
          console.log("User Logged!!!");
          alert("Login Success!");
        }
      }
    } catch (error) {
      console.log("login failed!");
      alert("Error:" + error.message);
    }
  };

  // Control Register
  const [RegUser, setRegUser] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    ConfirmPassword: "",
  });

  const handleReg = (e) => {
    const { name, value } = e.target;
    setRegUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    try {
      if (RegUser.password !== RegUser.ConfirmPassword) {
        console.log("try again");
        alert("Password mismatch!");
        return;
      }
      const response = await axios.post(`${apiUrl}/user`, {
        name: RegUser.name,
        email: RegUser.email,
        address: RegUser.address,
        phone: RegUser.phone,
        password: RegUser.password,
        ConfirmPassword: RegUser.ConfirmPassword,
      });
      if (response.data && response.data.err === "User exists!") {
        alert(
          "User with this email already exists. Please use a different email."
        );
      } else {
        console.log("Registration successful!!!");
        alert("Registration Success!!");
        window.location.href = "/home";
      }
    } catch (error) {
      alert("Registration Failed!!");
      console.error(error);
    }
  };

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  return (
    <div
      className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}
      ref={containerRef}
      id="container"
    >
      <div className="form-container sign-up-container">
        <form action="#" onSubmit={handleRegSubmit}>
          <h1 className="clr">Create Account</h1>
          <div className="social-container">
            <a href="#" className="social">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social">
              <i className="fab fa-google-plus-g"></i>
            </a>
            <a href="#" className="social">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <span className="clr">or use your email for registration</span>
          <input
            type="text"
            placeholder="Name"
            name="name"
            required
            onChange={handleReg}
            value={RegUser.name}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            onChange={handleReg}
            value={RegUser.email}
          />
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="contact no"
            required
            pattern="[0-9]{10}"
            maxLength={10}
            value={RegUser.phone}
            onChange={handleReg}
          />
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Address"
            required
            value={RegUser.address}
            onChange={handleReg}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            onChange={handleReg}
            value={RegUser.password}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="ConfirmPassword"
            required
            onChange={handleReg}
            value={RegUser.ConfirmPassword}
          />
          <button type="submit" className="btn-clr">
            Sign Up
          </button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form action="#" onSubmit={handleLoginSubmit}>
          <h1 className="clr">Sign in</h1>
          <div className="social-container">
            <a href="#" className="social">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social">
              <i className="fab fa-google-plus-g"></i>
            </a>
            <a href="#" className="social">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <span className="clr">or use your account</span>
          <input
            type="email"
            placeholder="Email"
            onChange={handleInput}
            name="email"
            required
            value={User.email}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={handleInput}
            name="password"
            required
            value={User.password}
          />
          <a href="#">Forgot your password?</a>
          <button type="submit" className="btn-clr">
            Sign In
          </button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button className="ghost" onClick={handleSignInClick}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" onClick={handleSignUpClick}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
