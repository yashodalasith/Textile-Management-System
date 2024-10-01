import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import api from "../../api";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";

const TABLE_HEAD = ["Product", "Quantity", "Price"];

export default function OrderConfirmation() {
  const [items, setItems] = useState([]);
  const [totalprice, setPrice] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("");
  const userId = localStorage.getItem("userId");

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

  // Function to download the bill as a PDF
  // download the bill as a PDF
  const downloadBillPDF = () => {
    const doc = new jsPDF();

    // Set Background Color (Light Blue)
    doc.setFillColor(173, 216, 230); // Light blue background (RGB: 173, 216, 230)
    doc.rect(10, 10, 190, 280, "F"); // Full-page background with padding

    // Underlined Header with Green Font
    doc.setTextColor(0, 128, 0); // Green color (RGB: 0, 128, 0)
    doc.setFontSize(18);
    doc.text("Thank You For The Purchase", 20, 30);
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32); // Underline for header

    // Bill Content with Padding and Borders
    doc.setTextColor(0, 0, 0); // Reset to black text for item details
    doc.setFontSize(12);
    let yPosition = 50; // Starting Y position for item listing

    items.forEach((item, index) => {
      // Border around each item with padding
      doc.text(
        `${index + 1}) ${item.quantity} x ${item.productName} - LKR ${
          item.quantity * item.price
        }`,
        25, // Adding padding to the left (x-axis)
        yPosition
      );
      yPosition += 7; // Adjust line height for padding
    });

    // Border around total amount section with padding

    // Red Font for Total Price
    doc.setTextColor(255, 0, 0); // Red color (RGB: 255, 0, 0)
    doc.text(`-Total Amount: LKR ${totalprice}`, 25, yPosition + 15);

    // Reset to black font for other details
    doc.setTextColor(0, 0, 0);
    doc.text(`-Amount to be Paid: LKR ${totalprice}`, 25, yPosition + 25);
    doc.text(`-Payment Status: ${paymentStatus}`, 25, yPosition + 35);

    // Signature Section
    doc.text("Signature: _________", 25, yPosition + 65);
    doc.text("Date: ___________", 25, yPosition + 75);

    // Download the generated PDF
    doc.save("bill-summary.pdf");
  };

  return (
    <div
      className="min-h-screen bg-top"
      style={{
        backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/012/617/311/non_2x/3d-pay-money-with-mobile-phone-banking-online-payments-concept-bill-on-smartphone-transaction-with-credit-card-mobile-with-financial-paper-on-background-3d-bill-payment-icon-illustration-vector.jpg')`,
      }}
    >
      <div className="text-center underline font-bold">
        <h1 className="text-3xl p-5 ">Payment Confirmation</h1>
      </div>

      <div className="flex justify-center p-4 m-4 items-center min-h-screen ">
        <div className="bg-white p-4 m-4 shadow-2xl rounded-lg  w-96 gap-4">
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
                  <span>= $ {item.quantity * item.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t-2 border-black mt-4 pt-4  gap-x-8">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Amount to be paid:</span>
              <span>$ {totalprice}</span>
            </div>

            <div className="flex justify-center font-semibold mb-4">
              <span>{paymentStatus}</span>
            </div>
            <div className="flex justify-between gap-4 mt-4">
              <Link to={"/home"}>
                <button className="w-max bg-blue-500 hover:bg-blue-600 text-white font-bold  py-2 px-2 rounded-lg">
                  Confirm the Payment
                </button>
              </Link>

              <button
                className="w-max bg-red-500 hover:bg-blue-600 text-white font-bold  py-2 px-2 rounded-lg"
                onClick={downloadBillPDF}
              >
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
