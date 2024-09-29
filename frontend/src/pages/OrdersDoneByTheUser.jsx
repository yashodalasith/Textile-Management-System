import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function OrdersDoneByTheUser() {
  const [orders, setOrders] = useState([]); // Initialize as an empty array
  const [filteredOrders, setFilteredOrders] = useState([]); // Orders after filtering
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState(""); // State for search input
  const [visibleOrders, setVisibleOrders] = useState(5); // Initially show 7 orders
  const userId = localStorage.getItem("userId");
  const baseUrl1 = "http://localhost:3001/order";

  useEffect(() => {
    // Fetch user orders from the backend
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl1}/orders/${userId}`);

        // Ensure the response is an array
        if (Array.isArray(response.data)) {
          setOrders(response.data);
          setFilteredOrders(response.data); // Initialize filteredOrders
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching orders:", err); // Log the error
        setError(
          err.response ? err.response.data.message : "Failed to fetch orders"
        );
      }
    };

    fetchOrders();
  }, [userId]);

  // Filter orders based on search date
  useEffect(() => {
    if (searchDate) {
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const formattedOrderDate = orderDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD
        return formattedOrderDate === searchDate;
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchDate, orders]);

  const downloadBillPDF = (order) => {
    if (!order || !Array.isArray(order.items)) {
      console.error("Invalid order data");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Old Bills Use only for Confirmation Purposes", 20, 20); // Header

    doc.setFontSize(12);
    let yPosition = 40; // Starting Y position for item listing

    // Adding the bill details
    order.items.forEach((item) => {
      doc.text(
        `${item.quantity} x ${item.productName} - $${(
          item.quantity * item.price
        ).toFixed(2)}`,
        20,
        yPosition
      );
      yPosition += 10;
    });

    doc.text(
      `Total Amount: $${order.totalPrice.toFixed(2)}`,
      20,
      yPosition + 10
    );
    const purchaseDate = new Date(order.createdAt);
    const formattedDate = purchaseDate.toLocaleDateString();
    const formattedTime = purchaseDate.toLocaleTimeString();
    doc.text(`Purchased date: ${formattedDate}`, 20, yPosition + 30);
    doc.text(`Time of Purchase: ${formattedTime}`, 20, yPosition + 40);

    doc.text(
      `Amount to be Paid: $${order.totalPrice.toFixed(2)}`,
      20,
      yPosition + 50
    );
    doc.text(`Payment Status: ${order.paymentStatus}`, 20, yPosition + 60);

    // Download the generated PDF
    doc.save(`order_${order._id}_bill.pdf`);
  };

  // Generate sequential order numbers based on creation date
  const generateOrderNumber = (index) => {
    return `Order${(index + 1).toString().padStart(3, "0")}`;
  };

  const handleViewMore = () => {
    setVisibleOrders(orders.length); // Show all orders
  };

  return (
    <div>
      <div className="flex justify-end mr-5 mt-4">
        <Link to={"/home"}>
          <Button>Home</Button>
        </Link>
      </div>{" "}
      <div style={OrdersDoneByTheUserStyles.container}>
        <h1 style={OrdersDoneByTheUserStyles.header}>Your Orders</h1>
        <p className="flex justify-center">Search By Date</p>
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          placeholder="Search by date"
          style={OrdersDoneByTheUserStyles.searchInput}
        />
        {error && <p style={OrdersDoneByTheUserStyles.error}>{error}</p>}
        <ul style={OrdersDoneByTheUserStyles.list}>
          {filteredOrders
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort by date
            .slice(0, visibleOrders) // Show only the visible orders
            .map((order, index) => (
              <li key={order._id} style={OrdersDoneByTheUserStyles.listItem}>
                <h3 style={OrdersDoneByTheUserStyles.orderId}>
                  Order ID: {generateOrderNumber(index)}
                </h3>
                <p style={OrdersDoneByTheUserStyles.totalPrice}>
                  Total Price: ${order.totalPrice.toFixed(2)}
                </p>
                <p style={OrdersDoneByTheUserStyles.status}>
                  Status: {order.orderStatus}
                </p>
                <button
                  onClick={() => downloadBillPDF(order)}
                  style={OrdersDoneByTheUserStyles.button}
                >
                  Download Bill
                </button>
              </li>
            ))}
        </ul>
        {visibleOrders < filteredOrders.length && (
          <button
            style={OrdersDoneByTheUserStyles.viewMoreButton}
            onClick={handleViewMore}
          >
            View All
          </button>
        )}
      </div>
    </div>
  );
}

// Inline styles
const OrdersDoneByTheUserStyles = {
  container: {
    padding: "20px",
    marginBottom: "100px",
    marginTop: "50px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    maxWidth: "800px",
    marginLeft: "400px ",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
    fontSize: "24px",
    fontFamily: "Arial, sans-serif",
  },

  searchInput: {
    display: "block",
    margin: "0 auto 20px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
    maxWidth: "300px",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "20px",
  },
  list: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
  },
  listItem: {
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
  },
  orderId: {
    fontSize: "18px",
    margin: "0 0 10px",
  },
  totalPrice: {
    fontSize: "16px",
    margin: "0 0 5px",
  },
  status: {
    fontSize: "14px",
    margin: "0 0 10px",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  viewMoreButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    display: "block",
    margin: "20px auto 0",
  },
};
