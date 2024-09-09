import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = ({ userId }) => {
  const [cart, setCart] = useState(null); // Default is null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the cart data from the backend
    const fetchCart = async () => {
      try {
        const response = await axios.get(`/cart/${userId}`);
        setCart(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch cart", error);
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  const confirmOrder = async () => {
    try {
      const response = await axios.post("/confirm-order", { userId });
      alert("Order confirmed!");
      window.location.href = "/confirm-order"; // Redirect to confirm-order page
    } catch (error) {
      console.error("Failed to confirm order", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {/* Check if cart exists and if cart.items exists */}
      {cart && cart.items && cart.items.length > 0 ? (
        <div>
          <ul className="divide-y divide-gray-200">
            {cart.items.map((item) => (
              <li key={item.productId} className="py-4">
                <div className="flex justify-between">
                  <span>{item.name}</span>
                  <span>
                    {item.quantity} x ${item.price} = $
                    {item.quantity * item.price}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={confirmOrder}
            >
              Confirm Order
            </button>
          </div>
        </div>
      ) : (
        <p>Your cart is empty </p>
      )}
    </div>
  );
};

export default Cart;

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
