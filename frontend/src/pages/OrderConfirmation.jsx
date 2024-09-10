import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import api from "../../api";

const TABLE_HEAD = ["Product", "Quantity", "Price"];

export default function OrderConfirmation() {
  const [items, setItems] = useState([]);
  const [totalprice, setPrice] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("");
  const userId = "mockUser123"; // Replace with actual userId or pass as a prop

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const res = await api.get(`/order/order-details/${userId}`);

        if (res.status === 200) {
          // Use status code for a successful response
          const data = res.data; // Access the data
          console.log(data);

          // Assuming your data structure contains these fields
          setItems(data.items);
          setPrice(data.totalPrice);
          setPaymentStatus(data.paymentStatus);
        } else {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error fetching order data:", error.message);
      }
    };

    getOrderDetails();
  }, [userId]);

  return (
    <div className="">
      <div className="text-center font-bold">
        <h1 className="text-3xl p-5 underline">Payment Confirmation</h1>
      </div>
      <div className="  shadow-2xl p-5 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4 flex  items-center ">
          Bill Summary
        </h2>

        <div className="flex justify-between mt-4">
          <ul>
            {items.map((items) => (
              <li key={items.productId}>
                {items.name} - Quantity: {items.quantity} -item price:{" "}
                {items.price}- Price: ${items.price * items.quantity}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between mt-4">
          <span className="font-medium">Total Amount:</span>
          <span>{totalprice}</span>
        </div>

        <div className="flex justify-between mt-4">
          <span className="font-medium">Discounts:</span>
          <span>0</span>
        </div>

        <div className="flex justify-between mt-4">
          <span className="font-medium">Amount to be paid:</span>
          <span>{totalprice}</span>
        </div>

        <div className="flex justify-between mt-4 mb-4">
          <span className="font-medium">{paymentStatus}</span>
          <span>Cash on Delivery</span>
        </div>

        {/* Confirm Payment Button */}
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
            Confirm Payment
          </button>
        </div>
      </div>{" "}
      <div className="pt-4">
        <p>Additional notes</p>
      </div>
    </div>
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
