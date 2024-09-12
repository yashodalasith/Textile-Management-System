import { Button } from "@material-tailwind/react";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { NavigationBar } from "./components/NavigationBar";
import ProductList from "./components/ProductList";
import CartPage from "./pages/CartPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/confirm-order" element={<OrderConfirmation />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
