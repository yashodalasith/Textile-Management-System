import { Button } from "@material-tailwind/react";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { NavigationBar } from "./components/NavigationBar";
import ProductList from "./components/ProductList";
import CartPage from "./components/CartPage";
import OrderConfirmation from "./components/OrderConfirmation";

export default function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/confirm-order" element={<OrderConfirmation />} />
      </Routes>
    </BrowserRouter>
  );
}
