import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { NavigationBar } from "../components/NavigationBar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [itemSalesData, setItemSalesData] = useState([]);
  const [mostSoldItems, setMostSoldItems] = useState([]);
  const [leastSoldItems, setLeastSoldItems] = useState([]);
  const [mostSalesHour, setMostSalesHour] = useState("");
  const [leastSalesHour, setLeastSalesHour] = useState("");
  const [discountHours, setDiscountHours] = useState(0);
  const [discountItems, setDiscountItems] = useState([]);
  const [message, setMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const discountAppliedTime = localStorage.getItem("discountButtonDisabled");

    if (discountAppliedTime) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - discountAppliedTime;

      if (elapsedTime >= 3600000) {
        // If more than 1 hour has passed, enable the button
        setIsDisabled(false);
        localStorage.removeItem("discountButtonDisabled");
      } else {
        // If less than 1 hour has passed, keep the button disabled and set a timeout for the remaining time
        setIsDisabled(true);
        setTimeout(() => {
          setIsDisabled(false);
          localStorage.removeItem("discountButtonDisabled");
        }, 3600000 - elapsedTime);
      }
    }
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/admindis/dashboard")
      .then((response) => {
        const data = response.data;
        setSalesData(data.hourlySales);
        setItemSalesData(data.itemSales);
        setMostSalesHour(data.mostSalesHour);
        setLeastSalesHour(data.leastSalesHour);
        setMostSoldItems(data.mostSoldItems);
        setLeastSoldItems(data.leastSoldItems);
        setDiscountHours(data.discountedHours);
        setDiscountItems(data.discountedItems);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDiscountNow = (type) => {
    // Disable the button and save the current time to local storage
    setIsDisabled(true);
    const discountAppliedTime = Date.now(); // Get the current timestamp
    localStorage.setItem("discountButtonDisabled", discountAppliedTime);

    // Apply discount now function
    axios
      .post("http://localhost:3001/api/discount/apply-discount", { type })
      .then((response) => {
        setMessage(`Discount applied successfully for ${type} items.`);
        // Refetch updated data
        axios
          .get("http://localhost:3001/api/admindis/dashboard")
          .then((res) => {
            setSalesData(res.data.hourlySales);
            setDiscountItems(res.data.discountedItems);
          });
      })
      .catch((err) => setMessage(`Error applying discount: ${err.message}`));

    // Re-enable the button after 1 hour (3600000 ms)
    setTimeout(() => {
      setIsDisabled(false);
      localStorage.removeItem("discountButtonDisabled");
    }, 3600000);
  };

  // Prepare chart data for sales graph (Hourly sales)
  const hourlySalesChartData = {
    labels: [...Array(24).keys()].map((hour) => `Hour ${hour}`),
    datasets: [
      {
        label: "Sales per Hour",
        data: salesData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Prepare chart data for item sales graph
  const itemSalesChartData = {
    labels: itemSalesData.map((item) => item.item_id),
    datasets: [
      {
        label: "Sales per Item",
        data: itemSalesData.map((item) => item.soldCount),
        borderColor: "rgba(153, 102, 255, 1.0)",
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true, // Ensures values start from 0
        ticks: {
          stepSize: 1, // Forces full integer steps
          callback: function (value) {
            if (value % 1 === 0 && value >= 0) {
              // Shows only positive integers
              return value;
            }
          },
        },
        min: 0,
      },
    },
  };

  return (
    <>
      <NavigationBar></NavigationBar>
      <div className="p-4 md:mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Admin Dashboard
        </h1>
        <div className="pt-4"></div>

        <div className="flex flex-row gap-10 max-w-screen justify-evenly items-start p-10 m-10">
          {/* Hourly Sales for Current Day */}
          <div className="flex flex-col p-3 gap-4 md:w-96 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">
                  Hourly Sales (for Upcoming Day)
                </h3>
              </div>
            </div>
            <div className="flex">
              <Line data={hourlySalesChartData} options={chartOptions} />
            </div>
            <div className="flex gap-2 text-sm">
              <div className="text-gray-500">Most Sales Hour:</div>
              <span className="text-green-500 flex items-center">
                {mostSalesHour}
              </span>
            </div>
            <div className="flex gap-2 text-sm">
              <div className="text-gray-500">Least Sales Hour:</div>
              <span className="text-red-500 flex items-center">
                {leastSalesHour}
              </span>
            </div>
          </div>

          <div className="px-4"></div>
          {/* Items with their Sales for Current Day */}
          <div className="flex flex-col p-3 gap-4 md:w-96 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">
                  Items with Sales (for Upcoming Day)
                </h3>
              </div>
            </div>
            <div className="flex">
              <Bar data={itemSalesChartData} options={chartOptions} />
            </div>
            <div className="flex flex-row">
              <div className="text-gray-500">Most Sold Item:</div>
              {mostSoldItems.length > 0 ? (
                mostSoldItems.map((mostSoldItem) => (
                  <div
                    key={mostSoldItem.item_id}
                    className="flex gap-2 text-sm"
                    style={{ paddingLeft: "1rem" }}
                  >
                    <span className="text-green-500 flex items-center">
                      {mostSoldItem.item_id} ({mostSoldItem.soldCount} sales),
                    </span>
                  </div>
                ))
              ) : (
                <div>No most sold items found.</div> // Fallback message if array is empty
              )}
            </div>

            <div className="flex flex-row">
              <div className="text-gray-500">Least Sold Item:</div>
              {leastSoldItems.length > 0 ? (
                leastSoldItems.map((leastSoldItem) => (
                  <div
                    key={leastSoldItem.item_id}
                    className="flex gap-2 text-sm"
                    style={{ paddingLeft: "1rem" }}
                  >
                    <span className="text-red-500 flex items-center">
                      {leastSoldItem.item_id} ({leastSoldItem.soldCount} sales),
                    </span>
                  </div>
                ))
              ) : (
                <div>No least sold items found.</div> // This ensures something is displayed if the array is empty
              )}
            </div>
          </div>
        </div>

        <div className="pt-4"></div>
        <div className="pt-4"></div>
        <div className="flex flex-row gap-10 justify-evenly items-start p-10 m-10">
          <div className="pl-4"></div>
          {/* Current Day's Discounting Hours */}
          <div className="flex flex-row p-10 pr-4 justify-between items-start md:w-96 w-full rounded-md shadow-md">
            <div className="flex flex-col p-3 gap-4 justify-center">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-500 text-md uppercase">
                    Discounting Hours (Current Day)
                  </h3>
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                <div className="text-gray-500">Discounting Hours:</div>
                <span className="text-green-500 flex items-center">
                  {!discountHours || discountHours.length < 2 ? (
                    <>
                      <div>Most: Data not available</div>
                      <div className="ml-4 text-red-500">
                        Least: Data not available
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        Most:{" "}
                        {(discountHours[0] || "Data not available")
                          .toString()
                          .padStart(2, "0")}
                        {discountHours[0] ? ":00" : ""}
                      </div>
                      <div className="ml-4 text-red-500">
                        Least:{" "}
                        {(discountHours[1] || "Data not available")
                          .toString()
                          .padStart(2, "0")}
                        {discountHours[1] ? ":00" : ""}
                      </div>
                    </>
                  )}
                </span>
              </div>
              <br />
              <br />
              <br />
              <br />
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => handleDiscountNow("hour")}
                  disabled={isDisabled} // Disable the button based on state
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    borderRadius: "0.375rem",
                    color: isDisabled
                      ? "#A0A0A0"
                      : "linear-gradient(90deg, #EC4899, #FFB037)",
                    background: "transparent",
                    border: isDisabled
                      ? "1px solid #A0A0A0"
                      : "1px solid #EC4899",
                    outline: "none",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled) {
                      e.target.style.background =
                        "linear-gradient(90deg, #EC4899, #FFB037)";
                      e.target.style.color = "white";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDisabled) {
                      e.target.style.background = "transparent";
                      e.target.style.color = "black";
                    }
                  }}
                >
                  {isDisabled
                    ? "Discount Active for an Hour"
                    : "Apply Discount Now"}
                </button>
              </div>
            </div>
            <div>
              <img
                src="https://cdn-icons-png.flaticon.com/512/4279/4279552.png"
                alt="product"
                style={{ width: "8cm", height: "8cm" }}
                className="p-4"
              />
            </div>
          </div>

          <div className="px-4"></div>
          {/* Current Day's Discounting Items */}
          <div className="flex flex-col p-3 gap-4 md:w-96 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">
                  Discounting Items (Current Day)
                </h3>
              </div>
            </div>
            <div className="flex">
              <table
                className="shadow-md"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#F3F4F6" }}>
                    <th style={{ padding: "12px" }}>Item ID</th>
                    <th style={{ padding: "12px" }}>Sales</th>
                    <th style={{ padding: "12px" }}>Discount</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "grey" }}>
                  {discountItems.map((item) => (
                    <tr
                      style={{ backgroundColor: "#FFFFFF" }}
                      key={item.item_id}
                    >
                      <td
                        style={{
                          padding: "12px",
                          fontWeight: "bold",
                          color: "#4B5563",
                          textAlign: "center",
                        }}
                      >
                        {item.item_id}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          fontWeight: "bold",
                          color: "#4B5563",
                          textAlign: "center",
                        }}
                      >
                        {item.soldCount}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          fontWeight: "bold",
                          color: "#4B5563",
                          textAlign: "center",
                        }}
                      >
                        {item.discount_precentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {message && <p className="text-sm text-red-500 mt-8">{message}</p>}
        <div className="pt-4"></div>
      </div>
    </>
  );
};

export default Dashboard;
