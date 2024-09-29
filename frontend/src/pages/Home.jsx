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
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Home Gallery Section */}
      <div style={{ marginBottom: "40px" }}>
        <HomeGallery />
      </div>

      {/* Loading Spinner Overlay */}
      {showLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 50,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                borderTop: "4px solid #3498db",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <p
              style={{
                marginTop: "20px",
                color: "#fff",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Loading...
            </p>
          </div>
        </div>
      )}

      {/* Cart Icon with Badge */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 10,
          backgroundColor: "#fff",
          padding: "10px",
          borderRadius: "50%",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        <Link
          to="/cart"
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          <div style={{ position: "relative" }}>
            <ShoppingCartIcon
              style={{ width: "40px", height: "40px", color: "#333" }}
            />
            {cartQuantity > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "22px",
                  height: "22px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#fff",
                  backgroundColor: "#f56565",
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

      {/* Products Listing */}
      {!loading && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "30px",
            marginTop: "50px",
          }}
        >
          {products.length > 0 &&
            products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "300px",
                  height: "500px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    transition: "transform 0.2s",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative", // Added for Sale Tag positioning
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {/* Sale Tag */}
                  {product.discount && (
                    <div
                      style={{
                        position: "absolute",
                        top: "20px",
                        left: "-20px",
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                        padding: "5px 20px",
                        fontWeight: "bold",
                        fontSize: "14px",
                        transform: "rotate(-45deg)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      }}
                    >
                      Sale
                    </div>
                  )}

                  {/* Product Image */}
                  <div
                    style={{
                      width: "100%",
                      height: "300px",
                      backgroundColor: "#f9f9f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.productName}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        borderRadius: "8px",
                      }}
                    />
                  </div>

                  {/* Product Information */}
                  <div style={{ padding: "20px" }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {product.productName}
                    </h3>
                    <p
                      style={{
                        margin: "10px 0",
                        fontSize: "14px",
                        color: "#666",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "16px",
                          color: "#999",
                          fontWeight: "bold",
                        }}
                      >
                        {product.quantity} pcs
                      </span>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            height: "40px", // Fixed height for price container
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {product.discount ? (
                            <>
                              <div
                                style={{
                                  color: "#e74c3c",
                                  fontWeight: "bold",
                                  fontSize: "18px",
                                }}
                              >
                                ${product.displayed_price.toFixed(2)}
                              </div>
                              <div
                                style={{
                                  textDecoration: "line-through",
                                  color: "#999",
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                  marginTop: "5px",
                                }}
                              >
                                ${product.price.toFixed(2)}
                              </div>
                            </>
                          ) : (
                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#333",
                              }}
                            >
                              ${product.price.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default Home;
