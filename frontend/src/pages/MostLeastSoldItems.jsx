import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Button } from "@material-tailwind/react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function MostLeastSoldItems() {
  const [mostSoldItem, setMostSoldItem] = useState(null);
  const [leastSoldItem, setLeastSoldItem] = useState(null);
  const [dailySpending, setDailySpending] = useState([]);
  const [itemsSummary, setItemsSummary] = useState([]);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
  const baseUrl = "http://localhost:3001/order";

  useEffect(() => {
    const fetchSoldItems = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/${userId}/most-least-sold-item`
        );
        const { mostSold, leastSold, dailySpending, itemsSummary } =
          response.data;
        setMostSoldItem(mostSold);
        setLeastSoldItem(leastSold);
        setDailySpending(dailySpending);
        setItemsSummary(itemsSummary);
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Failed to fetch data"
        );
      }
    };

    fetchSoldItems();
  }, [userId]);

  const generatePDF = async () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Summary of Purchased Items", 14, 22);

    // Most and Least Purchased Items
    doc.setFontSize(16);
    doc.text("Most Purchased Item:", 14, 40);
    if (mostSoldItem) {
      doc.text(
        `${mostSoldItem.productName} - ${mostSoldItem.totalQuantity} units Bought`,
        14,
        46
      );
    } else {
      doc.text("Loading...", 14, 46);
    }

    doc.text("Least Purchased Item:", 14, 54);
    if (leastSoldItem) {
      doc.text(
        `${leastSoldItem.productName} - ${leastSoldItem.totalQuantity} units Bought`,
        14,
        60
      );
    } else {
      doc.text("Loading...", 14, 60);
    }

    // Daily Spending Table
    doc.setFontSize(16);
    doc.text("Daily Spending:", 14, 70);
    const dailySpendingData = dailySpending.map((item) => ({
      date: item._id,
      amount: Number(item.totalSpentInDay) || 0, // Ensure amount is a number
    }));

    doc.autoTable({
      startY: 80,
      head: [["Date", "Total Spending"]],
      body: dailySpendingData.map((item) => [
        item.date,
        `$${item.amount.toFixed(2)}`,
      ]),
      styles: { cellPadding: 4 },
    });

    // Convert Bar and Pie Charts to Images and Add to PDF
    const barChartCanvas = document.getElementById("barChart");
    const pieChartCanvas = document.getElementById("pieChart");

    if (barChartCanvas && pieChartCanvas) {
      const barChartImage = barChartCanvas.toDataURL("image/png", 1.0);
      const pieChartImage = pieChartCanvas.toDataURL("image/png", 1.0);

      doc.addPage(); // Add a new page for charts
      doc.text("Charts:", 14, 20);

      doc.addImage(barChartImage, "PNG", 14, 30, 180, 100); // Add Bar Chart
      doc.addImage(pieChartImage, "PNG", 14, 140, 180, 100); // Add Pie Chart
    }

    // Amount Spent on Each Item Table
    doc.setFontSize(16);
    doc.text("Amount Spent on Each Item:", 14, doc.lastAutoTable.finalY + 10);
    const itemsSummaryData = itemsSummary.map((item) => ({
      product: item.productName,
      quantity: item.totalQuantity,
      amount: Number(item.totalAmountSpentOnItem) || 0, // Ensure amount is a number
    }));

    doc.autoTable({
      startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 200,
      head: [["Product", "Quantity", "Total Amount Spent"]],
      body: itemsSummaryData.map((item) => [
        item.product,
        item.quantity,
        `$${item.amount.toFixed(2)}`,
      ]),
      styles: { cellPadding: 4 },
    });

    // Signature and User Name Fields
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 220;
    doc.setFontSize(12);
    doc.text("Signature: ______________________", 14, finalY);

    // Save the PDF
    doc.save("summary_of_purchased_items.pdf");
  };

  // Bar chart data for daily spending
  const barData = {
    labels: dailySpending.map((item) => item._id), // Daily names
    datasets: [
      {
        label: "Total Spending",
        data: dailySpending.map((item) => item.totalSpentInDay),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data for amount spent on each item
  const pieData = {
    labels: itemsSummary.map((item) => item.productName),
    datasets: [
      {
        label: "Bought",
        data: itemsSummary.map((item) => item.totalAmountSpentOnItem),

        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Summary of Purchased Items</h1>
      {error && <p style={styles.error}>{error}</p>}
      {!error && (
        <>
          <div>
            <div>
              <div style={styles.itemsContainer}>
                <div style={styles.itemBox}>
                  <h2 style={styles.subHeader} className="text-red-500">
                    Most Purchased Item
                  </h2>
                  {mostSoldItem ? (
                    <p>
                      {mostSoldItem.productName} - {mostSoldItem.totalQuantity}{" "}
                      units Bought
                    </p>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
                <div style={styles.itemBox}>
                  <h2 style={styles.subHeader}>Least Purchased Item</h2>
                  {leastSoldItem ? (
                    <p>
                      {leastSoldItem.productName} -{" "}
                      {leastSoldItem.totalQuantity} units Bought
                    </p>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div style={styles.summaryContainer}>
                  <h2 style={styles.subHeader}>Items Summary</h2>
                  <ul>
                    {itemsSummary.map((item, index) => (
                      <li key={index}>
                        <div className="flex justify-between">
                          <div>
                            {item.totalQuantity} x {item.productName}
                          </div>
                          <div></div>
                          <div>${item.totalAmountSpentOnItem} spent</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4">
                {/* Bar Chart for Daily Spending */}
                <div style={styles.chartContainer}>
                  <h2 style={styles.subHeader}>Daily Spending</h2>
                  <Bar
                    data={barData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>

              {/* Pie Chart for Amount Spent on Each Item */}

              <div className="m-4">
                <div style={styles.chartContainer}>
                  <h2 style={styles.subHeader}>
                    Number of Items Purchased: Each
                  </h2>
                  <Pie
                    data={pieData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button onClick={generatePDF}>Download PDF</Button>
        </>
      )}
    </div>
  );
}

// Inline styles
const styles = {
  backgroundContainer: {
    backgroundImage:
      "url('https://media.istockphoto.com/photos/graphs-picture-id533272455?k=20&m=533272455&s=612x612&w=0&h=TobMsa4k6ccgdXKQ9eu0b2sjCeWtX-Z18t-Wn24JBYA=')",
    backgroundSize: "cover", // This makes the background cover the entire div
    backgroundPosition: "center", // This centers the image
    minHeight: "100vh", // Ensures the div takes at least the full height of the viewport
    padding: "20px", // Optional padding
  },
  container: {
    padding: "20px",
    marginTop: "50px",
    maxWidth: "700px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
    fontSize: "24px",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  itemsContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  itemBox: {
    width: "45%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
  },
  subHeader: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  chartContainer: {
    marginTop: "50px",
    marginBottom: "70px",
    height: "400px", // Adjust height for both charts
  },
  summaryContainer: {
    marginTop: "10px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f4f4f4",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontSize: "16px",
    color: "#333",
    lineHeight: "1.6",
  },
};
// Inline styles
