import { Button } from "@material-tailwind/react";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import { NavigationBar } from "./components/NavigationBar";
import ProductList from "./components/ProductList";
import CartPage from "./pages/CartPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import { Footer } from "./components/Footer";
import ViewProducts from "./pages/ViewProducts";
import UpdateProduct from "./pages/UpdateProduct";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/DiscountDashboard";
import Login from "../src/components/User/Login";
import UserProfile from "../src/components/User/UserProfile";
import UpdateUserProfile from "../src/components/User/UpdateUserDetails";
import OrdersDoneByTheUser from "../src/pages/OrdersDoneByTheUser";
import MostLeastSoldItems from "../src/pages/MostLeastSoldItems";

export default function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/home" element={<Home />} />
        {/* user routes */}
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<Login />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/updateProfile/:id" element={<UpdateUserProfile />} />
        <Route path="/OrdersDoneByTheUser" element={<OrdersDoneByTheUser />} />
        <Route path="/MostLeastSoldItems" element={<MostLeastSoldItems />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/confirm-order" element={<OrderConfirmation />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/products" element={<ViewProducts />} />
        <Route path="/update-product/:id" element={<UpdateProduct />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
