import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { AuthProvider } from "../AuthContext.jsx"; // ✅ add this

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>            {/* ✅ now context exists */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
