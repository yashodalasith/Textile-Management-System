import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Card,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import api from "../../api";
import { Link, useNavigate } from "react-router-dom";

const TABLE_HEAD = [
  "Product Name",
  "Price",
  "Quantity",
  "Selling Price",
  "Discounted",
  "Final price",
  "",
];

const baseUrl = "http://localhost:3001/cart";
const baseUrl1 = "http://localhost:3001/order";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoading, setShowLoading] = useState(true); // Track if loading spinner should be shown
  const userId = "mockUser123"; // Mock user ID
  const navigate = useNavigate();
  const startTimeRef = useRef(Date.now());

  const handleNavigate = () => {
    setOpen(false);
    navigate("/confirm-order");
  };

  const handleMakeOrder = async () => {
    try {
      const response = await axios.post(`${baseUrl1}/confirm-order`, {
        userId,
      });

      if (response.status === 200) {
        setOpen(true);
        console.log("Order details:", response.data);
      } else {
        setOpen(true);
        alert(response.data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Cart is Empty.");
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await axios.delete(`${baseUrl}/clear`, {
        data: { userId },
      });

      if (response.status === 200) {
        console.log(response.data);
      } else {
        alert(response.data.message || "Failed to clear cart.");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("An error occurred clearing the cart.");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await axios.delete(`${baseUrl}/remove`, {
        data: { userId, productId },
      });

      if (response.status === 200) {
        setCart(response.data.cart); // Update the cart
        window.location.reload();
      } else {
        alert(response.data.message || "Failed to remove item.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      startTimeRef.current = Date.now(); // Track the start time
      try {
        const response = await api.get(`/cart/${userId}`);
        setCart(response.data.items);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch cart");
      } finally {
        // Ensure loading spinner is shown for at least 1 second
        setTimeout(() => {
          setLoading(false);
          setShowLoading(false);
        }, Math.max(1000 - (Date.now() - startTimeRef.current), 0));
      }
    };
    fetchCart();
  }, [userId]);
  return (
    <div>
      {showLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
          <div className="flex flex-col ">
            <div className="animate-spin rounded-full h-2 w-16 border-t-4 border-blue-500 border-solid"></div>
            <p className="mt-4 text-lg font-semibold text-black z-60">
              Loading...
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-between">
        <div>
          <img
            src="https://static.vecteezy.com/system/resources/previews/000/356/583/original/vector-shopping-cart-icon.jpg"
            alt="product"
            style={{ width: "2cm", height: "2cm" }}
            className="p-4"
          />
        </div>
        <div className=" text-center text-3xl mt-4">My cart</div>
        <Link to={"/home"}>
          <button className="mr-4 text-center text-sm mt-4 ">Add more</button>
        </Link>
      </div>
      <Link to={"/OrdersDoneByTheUser"} className="flex justify-end mr-4 ">
        <Button>view previous orders</Button>
      </Link>
      <div className="flex justify-between">
        <div>
          <img
            src="https://ahmedstextiles.co.za/wp-content/uploads/2017/08/fabrics-36.jpg"
            alt="product"
            style={{ width: "6cm", height: "10cm" }}
            className="p-4"
          />
        </div>
        {!loading && (
          <Card className="h-full w-auto overflow-scroll shadow-2xl p-5 border rounded-lg">
            {cart.length === 0 ? (
              <div>
                <div>
                  <p className="text-center text-lg font-semibold text-gray-500">
                    Your cart is empty.
                  </p>
                </div>

                <div className="flex justify-center p-4">
                  <Link to={"/home"}>
                    <Button>Shop Items</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-100 bg-black p-4"
                      >
                        <Typography
                          variant="big"
                          color="white"
                          className="font-sans leading-none opacity-70 mt-4"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold mt-4 p-4"
                        >
                          {item.productName || "N/A"}
                        </Typography>
                      </td>
                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal mt-4 p-4"
                        >
                          ${item.price}
                        </Typography>
                      </td>
                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal mt-4 p-4"
                        >
                          {item.quantity}
                        </Typography>
                      </td>
                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal mt-4 p-4"
                        >
                          ${item.displayed_price.toFixed(2)}
                        </Typography>
                      </td>
                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal mt-4 p-4"
                        >
                          {item.discount ? "Yes" : "No"}
                        </Typography>
                      </td>
                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold mt-4 p-4"
                        >
                          ${(item.displayed_price * item.quantity).toFixed(2)}
                        </Typography>
                      </td>
                      <td>
                        <Typography
                          as="a"
                          href="#"
                          variant="small"
                          color="red"
                          className="font-medium mt-4 p-4"
                        >
                          <Link to={"/cart"}>
                            <button
                              className="text-red-700"
                              onClick={() => handleRemoveItem(item.productId)}
                            >
                              Remove Item
                            </button>
                          </Link>
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {cart.length > 0 && (
              <div className="flex justify-between">
                <div>
                  <button
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                    onClick={handleMakeOrder}
                  >
                    Make order
                  </button>
                  <Dialog open={open} handler={() => setOpen(false)}>
                    <DialogBody>
                      <p>Order placed successfully!</p>
                    </DialogBody>
                    <DialogFooter>
                      <Button
                        className="bg-blue-500 text-white"
                        onClick={handleNavigate}
                      >
                        Go to Confirmation Page
                      </Button>
                    </DialogFooter>
                  </Dialog>
                </div>
                <div>
                  <Link to={"/home"}>
                    <button
                      className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                      onClick={handleCancelOrder}
                    >
                      Cancel
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        )}

        <div>
          <img
            src="https://wallpaperaccess.com/full/4597148.jpg"
            alt="product"
            style={{ width: "6cm", height: "10cm" }}
            className="p-4"
          />
        </div>
      </div>

      <div className="flex justify-between m-4"></div>
    </div>
  );
}
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Cart = ({ userId }) => {
//   const [cart, setCart] = useState(null); // Default is null
//   const [loading, setLoading] = useState(true);
//   // const userId = "mockUser123";

//   useEffect(() => {
//     // Fetch the cart data from the backend

//     const fetchCart = async () => {
//       try {
//         const response = await axios.get(`/cart/${userId}`);
//         setCart(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch cart", error);
//         setLoading(false);
//       }
//     };
//     fetchCart();
//   }, [userId]);

//   const confirmOrder = async () => {
//     try {
//       const response = await axios.post("/confirm-order", { userId });
//       alert("Order confirmed!");
//       window.location.href = "/confirm-order"; // Redirect to confirm-order page
//     } catch (error) {
//       console.error("Failed to confirm order", error);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-bold mb-4">Your Cart</h2>
//       {/* Check if cart exists and if cart.items exists */}
//       {cart && cart.items && cart.items.length > 0 ? (
//         <div>
//           <ul className="divide-y divide-gray-200">
//             {cart.items.map((item) => (
//               <li key={item.productId} className="py-4">
//                 <div className="flex justify-between">
//                   <span>{item.name}</span>
//                   <span>
//                     {item.quantity} x ${item.price} = $
//                     {item.quantity * item.price}
//                   </span>
//                 </div>
//               </li>
//             ))}
//           </ul>
//           <div className="mt-4">
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//               onClick={confirmOrder}
//             >
//               Confirm Order
//             </button>
//           </div>
//         </div>
//       ) : (
//         <p>Your cart is empty </p>
//       )}
//     </div>
//   );
// };

// export default Cart;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";

// const CartPage = () => {
//   const [cart, setCart] = useState([]);

//   useEffect(() => {
//     const fetchCart = async () => {
//       const response = await api.get("/api/cart/123");
//       setCart(response.data.items);
//     };
//     fetchCart();
//   }, []);

//   const removeFromCart = async (productId) => {
//     await api.delete(`/api/cart/123/remove`, { data: { productId } });
//   };

//   return (
//     <div>
//       <h1>Your Cart</h1>
//       {cart.map((item) => (
//         <div key={item.productId}>
//           <p>Product: {item.productId}</p>
//           <p>Quantity: {item.quantity}</p>
//           <button onClick={() => removeFromCart(item.productId)}>Remove</button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CartPage;
