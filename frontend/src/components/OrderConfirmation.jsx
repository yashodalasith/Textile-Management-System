import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);

  // Confirm the order
  const confirmOrder = async () => {
    try {
      const response = await axios.post("/order/confirm-order", {
        userId: "mockUser123",
      });
      setOrder(response.data.order); // Store order details
    } catch (error) {
      console.error("Error confirming order", error);
    }
  };

  useEffect(() => {
    confirmOrder();
  }, []);

  return (
    <div>
      <h2>Order Confirmation</h2>
      {order ? (
        <div>
          <h3>Order ID: {order._id}</h3>
          <p>Total Price: ${order.totalPrice}</p>
          <p>Payment Status: {order.paymentStatus}</p>
          <p>Order Status: {order.orderStatus}</p>
        </div>
      ) : (
        <p>Confirming your order...</p>
      )}
    </div>
  );
};

export default OrderConfirmation;

// import React, { useState } from "react";
// import api from "../services/api";

// const OrderConfirmation = () => {
//   const [orderConfirmed, setOrderConfirmed] = useState(false);

//   const confirmOrder = async () => {
//     const response = await api.post("/api/order/confirm-order", {
//       userId: "123",
//     });
//     if (response.status === 200) setOrderConfirmed(true);
//   };

//   return (
//     <div>
//       <h1>Confirm Your Order</h1>
//       <button onClick={confirmOrder}>Confirm Order</button>
//       {orderConfirmed && <p>Order confirmed successfully!</p>}
//     </div>
//   );
// };

// export default OrderConfirmation;
