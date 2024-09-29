import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { HomeGallery } from "../components/HomeGallery";
// Using Heroicons for the cart icon
// import { jwtDecode } from "jwt-decode";

const URL = "http://localhost:3001/Products/products";
const CART_URL = "http://localhost:3001/cart"; // Adjust this if needed

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const userId = localStorage.getItem("userId"); // Replace this with the dynamic user ID
  const startTimeRef = useRef(Date.now());
  // const [userId, setUserId] = useState(null);
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     try {
  //       const decoded = jwtDecode(token);
  //       setUserId(decoded._id); // Set userId in state
  //       console.log(userId)
  //     } catch (error) {
  //       console.error("Invalid token:", error);
  //     }
  //   } else {
  //     console.error("No token found in local storage.");
  //   }
  // }, []);

  useEffect(() => {
    // Fetch Products
    const fetchProducts = async () => {
      startTimeRef.current = Date.now();
      try {
        const response = await axios.get(URL);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setShowLoading(false);
        }, Math.max(500 - (Date.now() - startTimeRef.current), 0));
      }
    };

    // Fetch Cart Quantity
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${CART_URL}/${userId}`);
        const cart = response.data;

        if (cart && Array.isArray(cart.items)) {
          // Calculate total quantity in the cart
          const totalQuantity = cart.items.reduce(
            (acc, item) => acc + (item.quantity || 0),
            0
          );
          setCartQuantity(totalQuantity);
          console.log(totalQuantity);
        } else {
          // If cart is not structured as expected, set quantity to 0
          setCartQuantity(0);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartQuantity(0); // Set quantity to 0 on error
      }
    };

    fetchProducts();
    fetchCart();
  }, [userId]);

  return (
    <div className="p-6">
      <HomeGallery />
      {showLoading && (
        <div className="fixed inset-0 flex  justify-center items-center bg-gray-700 bg-opacity-50 z-50">
          <div className="flex flex-col ">
            <div className="animate-spin rounded-full h-2 w-16 border-t-4 border-blue-500 border-solid"></div>
            {/* <p className="mt-4 text-lg font-semibold text-black z-60">
              Loading...
            </p>{" "} */}
            {/* Added z-60 */}
          </div>
        </div>
      )}
      {/* Cart Icon with Badge */}
      <div className="fixed bottom-4 right-4 z-10">
        <Link to="/cart">
          <div className="relative">
            <ShoppingCartIcon className="w-10 h-10 text-gray-600" />
            {cartQuantity > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                  height: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#fff",
                  backgroundColor: "#f56565", // A shade of red
                  borderRadius: "50%",
                  transform: "translate(50%, -50%)",
                }}
              >
                {cartQuantity}
              </span>
            )}
          </div>
        </Link>
      </div>
      {!loading && (
        <div className="mt-16 flex flex-wrap justify-center">
          {products.length > 0 &&
            products.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`}>
                <Card
                  className="bg-white shadow-md rounded-lg overflow-hidden"
                  style={{
                    width: "300px",
                    height: "425px",
                    margin: "15px",
                    padding: "4px",
                  }}
                >
                  <CardBody
                    style={{ padding: "10px", height: "calc(100% - 40px)" }}
                  >
                    <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-48 h-48 object-cover"
                        style={{
                          borderRadius: "8px",
                          height: "250px",
                          width: "270px",
                          marginTop: "15px",
                        }}
                      />
                    </div>
                    <Typography
                      variant="h6"
                      className="mt-4 text-left font-semibold"
                      style={{ color: "black" }}
                    >
                      {product.productName}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="mt-2 text-left truncate"
                      style={{ color: "gray" }}
                    >
                      {product.description}
                    </Typography>
                    <div className="flex justify-between items-center mt-4">
                      <div
                        className="text-gray-400"
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          color: "gray",
                        }}
                      >
                        {product.quantity} pcs
                      </div>
                      <div className="flex flex-col items-end">
                        {product.discount ? (
                          <>
                            <div
                              className="text-red-500"
                              style={{
                                fontWeight: "bold",
                                fontSize: "16px",
                                marginBottom: "2px",
                              }}
                            >
                              ${product.displayed_price.toFixed(2)}
                            </div>
                            <div
                              className="text-gray-500"
                              style={{
                                textDecoration: "line-through",
                                fontWeight: "bold",
                                fontSize: "16px",
                                marginTop: "-4px",
                                marginBottom: "10px",
                              }}
                            >
                              ${product.price.toFixed(2)}
                            </div>
                          </>
                        ) : (
                          <div
                            className="text-black"
                            style={{ fontWeight: "bold", fontSize: "16px" }}
                          >
                            ${product.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default Home;
