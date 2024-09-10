import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { NavigationBar } from "./components/NavigationBar";
import Dashboard from "./pages/DiscountDashboard";
import ProductList from "./components/ProductList";
import CartPage from "./pages/CartPage";
import OrderConfirmation from "./pages/OrderConfirmation";

export default function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/confirm-order" element={<OrderConfirmation />} />
      </Routes>
    </BrowserRouter>
  );
}
