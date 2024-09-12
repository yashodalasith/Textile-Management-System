import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import api from "../../api";
import { Link } from "react-router-dom";

const TABLE_HEAD = ["Product", "Quantity", "Price"];

export default function OrderConfirmation() {
  const [items, setItems] = useState([]);
  const [totalprice, setPrice] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("");
  const userId = "mockUser123";

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const res = await api.get(`/order/order-details/${userId}`);

        if (res.status === 200) {
          const data = res.data; // Access the data
          console.log(data);

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
    <div>
      <div className="text-center underline font-bold">
        <h1 className="text-3xl p-5 ">Payment Confirmation</h1>
      </div>

      <div className="flex justify-center p-4 m-4 items-center min-h-screen bg-gray-100">
        <div className="bg-blue-700 p-4 m-4 shadow-2xl rounded-lg p-8 w-96 gap-4">
          <h2 className="text-2xl font-bold text-center mb-6">Bill Summary</h2>
          <div className="mb-4">
            <ul className="mb-4">
              <li className="flex justify-between font-semibold gap-4">
                <span>Items Purchased</span>
                <span>- Amount</span>
              </li>
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex justify-between mt-2 gap-4"
                >
                  <span>
                    {item.quantity} x {item.productName}
                  </span>
                  <span>= LKR {item.quantity * item.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t-2 border-black mt-4 pt-4  gap-x-8">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Total Amount:</span>
              <span>LKR {totalprice}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="font-medium">Discounts:</span>
              <span>LKR 0</span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="font-medium">Amount to be paid:</span>
              <span>LKR {totalprice}</span>
            </div>

            <div className="flex justify-between font-semibold mb-4">
              <span>{paymentStatus}</span>
            </div>
            <div className="flex justify-between gap-4 mt-4">
              <Link to={"/"}>
                <button className="w-max bg-blue-500 hover:bg-blue-600 text-white font-bold  py-2 px-2 rounded-lg">
                  Confirm the Payment
                </button>
              </Link>

              <button className="w-max bg-red-500 hover:bg-blue-600 text-white font-bold  py-2 px-2 rounded-lg">
                Download the Bill
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4"></div>
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
