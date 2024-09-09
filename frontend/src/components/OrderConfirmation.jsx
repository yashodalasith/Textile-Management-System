import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";

const TABLE_HEAD = ["Product ID", "Quantity", "Price", ""];

export default function OrderConfirmation() {
  const [orders, setOrders] = useState([]);
  const userId = "mockUser123"; // Replace with actual userId or pass as a prop
  const orderId = "66de80de51e8101e332f76cd"; // Replace with actual orderId

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const res = await fetch(
          `/api/order/order-details/${userId}/${orderId}`
        );
        const data = await res.json();
        if (res.ok) {
          setOrders(data.items || []); // Adjust based on the API response
        } else {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error fetching order data:", error.message);
      }
    };
    getOrderDetails();
  }, [userId, orderId]);

  return (
    <Card className="h-full w-full overflow-scroll">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  No orders found
                </Typography>
              </td>
            </tr>
          ) : (
            orders.map((order, index) => {
              const isLast = index === orders.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={order._id}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {order.productId}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {order.quantity}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {order.price}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      Edit
                    </Typography>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </Card>
  );
}

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// function ConfirmOrderPage() {
//   const userId = useSelector((state) => state.user.userId);
//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     // Fetch the order data for the user
//     if (userId) {
//       axios.get(`/order/${userId}`).then((response) => {
//         setOrder(response.data);
//       });
//     }
//   }, [userId]);

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>

//       {order ? (
//         <div className="bg-white shadow-md rounded p-6">
//           <h2 className="text-2xl font-bold mb-4">Order #{order._id}</h2>

//           <table className="min-w-full table-auto">
//             <thead>
//               <tr>
//                 <th className="text-left font-bold text-gray-600 p-2">Item</th>
//                 <th className="text-left font-bold text-gray-600 p-2">Price</th>
//                 <th className="text-left font-bold text-gray-600 p-2">
//                   Quantity
//                 </th>
//                 <th className="text-left font-bold text-gray-600 p-2">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {order.items.map((item, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="p-2">{item.name}</td>
//                   <td className="p-2">${item.price.toFixed(2)}</td>
//                   <td className="p-2">{item.quantity}</td>
//                   <td className="p-2">
//                     ${(item.price * item.quantity).toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//               <tr>
//                 <td colSpan="3" className="text-right font-bold p-2">
//                   Total Price:
//                 </td>
//                 <td className="font-bold p-2">
//                   ${order.totalPrice.toFixed(2)}
//                 </td>
//               </tr>
//             </tbody>
//           </table>

//           <div className="mt-4">
//             <p className="font-bold text-lg">
//               Payment Status:{" "}
//               <span className="text-green-500">{order.paymentStatus}</span>
//             </p>
//             <p className="font-bold text-lg">
//               Order Status:{" "}
//               <span className="text-blue-500">{order.orderStatus}</span>
//             </p>
//           </div>
//         </div>
//       ) : (
//         <p>Loading order details...</p>
//       )}
//     </div>
//   );
// }

// export default ConfirmOrderPage;

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
