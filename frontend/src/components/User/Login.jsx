import React, { useState, useRef } from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert
import api from "../../services/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

function Login() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const containerRef = useRef(null);

  // Control login
  const [User, setUser] = useState({
    email: "",
    password: "",
  });

  // Snackbar state
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const SendRequest = async () => {
    try {
      const res = await api.post("http://localhost:3001/login/", {
        email: User.email,
        password: User.password,
      });
      return res.data;
    } catch (error) {
      throw new Error("Login failed!!");
    }
  };

  const [adminNavigationDialog, setAdminNavigationDialog] = useState(false);
  const [navigationPath, setNavigationPath] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await SendRequest();
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        localStorage.setItem("userId", response.userId);

        if (response.role === "admin") {
          setMessage("Hello Admin!!");
          setSeverity("success");
          setOpen(true);

          // Open dialog to ask where admin wants to navigate
          setAdminNavigationDialog(true);
        } else if (response.role === "InventoryManager") {
          setMessage("Hello Inventory Manager!!");
          setSeverity("success");
          setOpen(true);
          setTimeout(() => {
            window.location.href = "/products";
          }, 3000);
        } else {
          setMessage("Login Success!");
          setSeverity("success");
          setOpen(true);
          setTimeout(() => {
            window.location.href = "/home";
          }, 3000);
        }
      }
    } catch (error) {
      setMessage("Error: " + error.message);
      setSeverity("error");
      setOpen(true);
    }
  };

  const handleAdminNavigation = (path) => {
    setAdminNavigationDialog(false);
    setNavigationPath(path);
    setTimeout(() => {
      window.location.href = path;
    }, 3000);
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
        setMessage("Password mismatch!");
        setSeverity("error");
        setOpen(true);
        return;
      }
      const response = await api.post("/user", {
        name: RegUser.name,
        email: RegUser.email,
        address: RegUser.address,
        phone: RegUser.phone,
        password: RegUser.password,
        ConfirmPassword: RegUser.ConfirmPassword,
      });
      if (response.data && response.data.err === "User exists!") {
        setMessage(
          "User with this email already exists. Please use a different email."
        );
        setSeverity("error");
        setOpen(true);
      } else {
        setMessage("Registration Success!!");
        setSeverity("success");
        setOpen(true);

        // Delay navigation by 3 seconds (match Snackbar duration)
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    } catch (error) {
      setMessage("Registration Failed!!");
      setSeverity("error");
      setOpen(true);
    }
  };

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#f6f5f7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        margin: "0",
      }}
    >
      <div
        className={`container ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
        ref={containerRef}
        id="container"
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow:
            "0 14px 28px rgba(107, 64, 64, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",
          position: "relative",
          overflow: "hidden",
          width: "768px",
          maxWidth: "100%",
          minHeight: "600px",
          margin: "auto",
        }}
      >
        <div className="form-container sign-up-container">
          <form
            action="#"
            onSubmit={handleRegSubmit}
            style={{
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              padding: "0 50px",
              height: "auto",
              textAlign: "center",
            }}
          >
            <h1
              className="font-mono ..."
              style={{
                fontWeight: "bold",
                fontSize: "40px",
                color: "#469cce",
                marginTop: "8px",
              }}
            >
              Create Account
            </h1>
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
            <span className="clr" style={{ fontSize: "12px" }}>
              or use your email for registration
            </span>
            <input
              type="text"
              placeholder="Name"
              name="name"
              required
              onChange={handleReg}
              value={RegUser.name}
              style={{
                backgroundColor: "#e0e0e0",
                border: "none",
                padding: "12px 15px",
                margin: "8px 0",
                width: "100%",
                color: "#469cce",
                borderRadius: "10px",
              }}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              required
              onChange={handleReg}
              value={RegUser.email}
              style={{
                backgroundColor: "#e0e0e0",
                border: "none",
                padding: "12px 15px",
                margin: "8px 0",
                width: "100%",
                color: "#469cce",
                borderRadius: "10px",
              }}
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
              style={{
                backgroundColor: "#e0e0e0",
                border: "none",
                padding: "12px 15px",
                margin: "8px 0",
                width: "100%",
                color: "#469cce",
                borderRadius: "10px",
              }}
            />
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Address"
              required
              value={RegUser.address}
              onChange={handleReg}
              style={{
                backgroundColor: "#e0e0e0",
                border: "none",
                padding: "12px 15px",
                margin: "8px 0",
                width: "100%",
                color: "#469cce",
                borderRadius: "10px",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
              onChange={handleReg}
              value={RegUser.password}
              style={{
                backgroundColor: "#e0e0e0",
                border: "none",
                padding: "12px 15px",
                margin: "8px 0",
                width: "100%",
                color: "#469cce",
                borderRadius: "10px",
              }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="ConfirmPassword"
              required
              onChange={handleReg}
              value={RegUser.ConfirmPassword}
              style={{
                backgroundColor: "#e0e0e0",
                border: "none",
                padding: "12px 15px",
                margin: "8px 0",
                width: "100%",
                color: "#469cce",
                borderRadius: "10px",
              }}
            />
            <button
              type="submit"
              className="btn-clr"
              style={{
                borderRadius: "20px",
                border: "1px solid #469cce",
                backgroundColor: "#469cce",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: "bold",
                padding: "12px 45px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                transition: "transform 80ms ease-in",
              }}
            >
              Sign Up
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form
            action="#"
            onSubmit={handleLoginSubmit}
            style={{
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              padding: "0 50px",
              height: "auto",
              textAlign: "center",
            }}
          >
            <h1
              className="font-mono ..."
              style={{ fontWeight: "bold", fontSize: "50px", color: "#469cce" }}
            >
              Sign in
            </h1>
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
            <span className="clr" style={{ fontSize: "12px" }}>
              or use your account
            </span>
            <input
              type="email"
              placeholder="Email"
              onChange={handleInput}
              name="email"
              required
              value={User.email}
              style={{
                backgroundColor: "#e0e0e0",
                border: "none",
                padding: "12px 15px",
                margin: "8px 0",
                width: "100%",
                color: "#469cce",
                borderRadius: "10px",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={handleInput}
              name="password"
              required
              value={User.password}
              style={{
                backgroundColor: "#e0e0e0",
                border: "none",
                padding: "12px 15px",
                margin: "8px 0",
                width: "100%",
                color: "#469cce",
                borderRadius: "10px",
              }}
            />
            <a
              href="#"
              style={{
                color: "#333",
                fontSize: "14px",
                textDecoration: "none",
                margin: "15px 0",
              }}
            >
              Forgot your password?
            </a>
            <button
              type="submit"
              className="btn-clr"
              style={{
                borderRadius: "20px",
                border: "1px solid #469cce",
                backgroundColor: "#469cce",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: "bold",
                padding: "12px 45px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                transition: "transform 80ms ease-in",
              }}
            >
              Sign In
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1
                className="font-mono ..."
                style={{
                  fontWeight: "bold",
                  fontSize: "60px",
                  backgroundColor: "transparent",
                  borderColor: "#FFFFFF",
                }}
              >
                Welcome Back!
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 100,
                  lineHeight: "20px",
                  letterSpacing: "0.5px",
                  margin: "20px 0 30px",
                }}
              >
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost"
                onClick={handleSignInClick}
                style={{
                  borderRadius: "20px",
                  border: "1px solid ",

                  bordercolor: "#FFFFFF",
                  backgroundColor: "transparent",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "12px 45px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  transition: "transform 80ms ease-in",
                }}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1
                className="font-mono ..."
                style={{ fontWeight: "bold", fontSize: "60px" }}
              >
                Hello, Friend!
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 100,
                  lineHeight: "20px",
                  letterSpacing: "0.5px",
                  margin: "20px 0 30px",
                }}
              >
                Enter your personal details and start your journey with us
              </p>
              <button
                className="ghost"
                onClick={handleSignUpClick}
                style={{
                  marginTop: "16px",
                  borderRadius: "20px",
                  border: "1px solid ",

                  bordercolor: "#FFFFFF",
                  backgroundColor: "transparent",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "12px 45px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  transition: "transform 80ms ease-in",
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        <Dialog
          open={adminNavigationDialog}
          onClose={() => setAdminNavigationDialog(false)}
          PaperProps={{
            style: {
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "400px",
              textAlign: "center",
            },
          }}
        >
          <DialogTitle style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            Hello Admin 👋
          </DialogTitle>

          <DialogContent>
            <DialogContentText
              style={{ marginBottom: "20px", fontSize: "1.1rem" }}
            >
              Where would you like to navigate?
            </DialogContentText>

            <Button
              onClick={() => handleAdminNavigation("/dashboard")}
              variant="contained"
              color="primary"
              fullWidth
              style={{
                marginBottom: "10px",
                padding: "10px",
                fontSize: "1rem",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between", // Space between text and icon
                alignItems: "center", // Align icon and text vertically
              }}
            >
              Dashboard
              <ArrowForward /> {/* Icon placed at the end */}
            </Button>

            <Button
              onClick={() => handleAdminNavigation("/products")}
              variant="contained"
              color="secondary"
              fullWidth
              style={{
                padding: "10px",
                fontSize: "1rem",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between", // Space between text and icon
                alignItems: "center", // Align icon and text vertically
              }}
            >
              Products
              <ArrowForward /> {/* Icon placed at the end */}
            </Button>
          </DialogContent>
        </Dialog>
        {/* Snackbar component */}
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default Login;
