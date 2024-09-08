import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button, Card, Typography } from "@material-tailwind/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [discountedItems, setDiscountedItems] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch dashboard data
  //   useEffect(() => {
  //     axios.get('/api/discount/dashboard')
  //       .then(response => {
  //         setSalesData(response.data.hourlySales);
  //         setDiscountedItems(response.data.discountedItems);
  //       })
  //       .catch(err => console.error(err));
  //   }, []);

  // Function to apply discount now
  const handleDiscountNow = (type) => {
    axios
      .post("/api/discount/apply-discount", { type })
      .then((response) => {
        setMessage(`Discount applied successfully for ${type} sold items.`);
        // Refetch updated data
        axios.get("/api/discount/dashboard").then((res) => {
          setSalesData(res.data.hourlySales);
          setDiscountedItems(res.data.discountedItems);
        });
      })
      .catch((err) => setMessage(`Error applying discount: ${err.message}`));
  };

  // Prepare data for the chart
  const chartData = {
    labels: [...Array(24).keys()].map((hour) => `Hour ${hour}`), // Labels for 24 hours
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Admin Dashboard
        </h1>

        {/* Discount Now Buttons */}
        <div className="flex justify-between items-center mb-8">
          <Typography
            variant="h6"
            className="text-lg font-semibold text-gray-700"
          >
            Apply Discounts Now
          </Typography>
          <div className="flex space-x-4">
            <Button color="green" onClick={() => handleDiscountNow("most")}>
              Give Discount Now (Most Sold)
            </Button>
            <Button color="blue" onClick={() => handleDiscountNow("least")}>
              Give Discount Now (Least Sold)
            </Button>
          </div>
        </div>
        {message && <p className="text-sm text-red-500 mb-8">{message}</p>}

        {/* Sales Graph */}
        <Card className="p-6 mb-8">
          <Typography variant="h5" className="text-gray-800 mb-4">
            Hourly Sales
          </Typography>
          <Line data={chartData} />
        </Card>

        {/* Discounted Items Section */}
        <Card className="p-6 mb-8">
          <Typography variant="h5" className="text-gray-800 mb-4">
            Discounted Items
          </Typography>
          <ul className="space-y-2">
            {/* {discountedItems.map(item => (
              <li key={item.item_id} className="text-gray-600">
                {item.name}: {item.displayed_price} (Discount: {item.discount_percentage}%)
              </li>
            ))} */}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
