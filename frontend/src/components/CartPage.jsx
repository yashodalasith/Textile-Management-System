import React, { useState, useEffect } from "react";
import axios from "axios";

const CartPage = () => {
  const [cart, setCart] = useState(null);

  // Fetch cart details
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("/cart");
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching cart", error);
      }
    };
    fetchCart();
  }, []);

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await axios.put("/cart/update", { productId, quantity });
      setCart(response.data); // Update cart in UI
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`/cart/remove/${productId}`);
      setCart(response.data); // Update cart in UI
    } catch (error) {
      console.error("Error removing item", error);
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart ? (
        <div>
          {cart.items.map((item) => (
            <div key={item.productId}>
              <p>{item.name}</p>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
              >
                +
              </button>
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
              >
                -
              </button>
              <button onClick={() => removeFromCart(item.productId)}>
                Remove
              </button>
            </div>
          ))}
          <h3>Total: ${cart.totalPrice}</h3>
          <button onClick={() => (window.location.href = "/confirm-order")}>
            Proceed to Checkout
          </button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;

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
