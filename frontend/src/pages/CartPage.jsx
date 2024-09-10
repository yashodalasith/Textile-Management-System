import { Button, Card, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api";

const TABLE_HEAD = [
  "Image",
  "Product Name",
  "Price",
  "Quantity",
  "Total Amount",
  "Discounts",
  "Final price",
  "",
  "",
];

const TABLE_ROWS = [
  {
    Image: "",
    name: "Jeans",
    Price: "1000 LKR",
    Quantity: "2",
    Total: "2000",
    Discounts: "0",
    Final: "2000",
  },
  {
    Image: "",
    name: "Jeans",
    Price: "1000 LKR",
    Quantity: "2",
    Total: "2000",
    Discounts: "0",
    Final: "2000",
  },
  {
    Image: "",
    name: "Jeans",
    Price: "1000 LKR",
    Quantity: "2",
    Total: "2000",
    Discounts: "0",
    Final: "2000",
  },
  {
    Image: "",
    name: "Jeans",
    Price: "1000 LKR",
    Quantity: "2",
    Total: "2000",
    Discounts: "0",
    Final: "2000",
  },
  {
    Image: "",
    name: "Jeans",
    Price: "1000 LKR",
    Quantity: "2",
    Total: "2000",
    Discounts: "0",
    Final: "2000",
  },
];

const baseUrl = "http://localhost:3001/cart"; // Adjust based on your server setup
const baseUrl1 = "http://localhost:3001/order";
// Handle the "Make Order" button click
const handleMakeOrder = async () => {
  try {
    const userId = "mockUser123"; // Replace this with the actual user ID
    const response = await axios.post(`${baseUrl1}/confirm-order`, { userId });

    if (response.status === 200) {
      alert("Order placed successfully!");
      console.log("Order details:", response.data);
    } else {
      alert(response.data.message || "Failed to place order.");
    }
  } catch (error) {
    console.error("Error placing order:", error);
    alert("An error occurred while placing the order.");
  }
};

// Handle the "Cancel" button click
const handleCancelOrder = async () => {
  try {
    const userId = "mockUser123"; // Replace this with the actual user ID
    const response = await axios.delete(`${baseUrl}/clear`, {
      data: { userId },
    });

    if (response.status === 200) {
      alert("Cart cleared successfully!");
      console.log("Cleared cart details:", response.data);
    } else {
      alert(response.data.message || "Failed to clear cart.");
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    alert("An error occurred while clearing the cart.");
  }
};

export default function CartPage() {
  const [cart, setCart] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = "mockUser123"; // Mock user ID

  // Fetch the cart data when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get(`/cart/${userId}`);
        console.log(response);
        setCart(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);
  return (
    <div className="">
      <div className="flex justify-between">
        <div>
          <img
            src="https://static.vecteezy.com/system/resources/previews/000/356/583/original/vector-shopping-cart-icon.jpg"
            alt="product"
            style={{
              width: "2cm",
              height: "2cm",
            }}
            className="p-4"
          />
        </div>{" "}
        <div className="m-5 text-center text-3xl mt-4">My cart</div>
        <button className="mr-4 text-center text-sm mt-4">Add more</button>
      </div>
      <div className="flex justify-center">
        <Card className="h-full w-auto overflow-scroll shadow-2xl p-5 border rounded-lg">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b  border-blue-100 bg-black p-4"
                  >
                    <Typography
                      variant="small"
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
              {TABLE_ROWS.map(
                (
                  { Image, name, Price, Quantity, Total, Discounts, Final },
                  index
                ) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={name}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {Image}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {Price}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {Quantity}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {Total}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {Discounts}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {Final}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          as="a"
                          href="#"
                          variant="small"
                          color="red"
                          className="font-medium"
                        >
                          Remove
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
          <div className="flex justify-between">
            <div>
              <button
                className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                onClick={handleMakeOrder} // Add the onClick event for making the order
              >
                Make order
              </button>
            </div>
            <div>
              <button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                onClick={handleCancelOrder} // Add the onClick event for canceling the order
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
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
