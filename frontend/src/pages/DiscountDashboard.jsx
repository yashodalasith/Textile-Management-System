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
  const [itemSalesData, setItemSalesData] = useState([]);
  const [mostSoldItem, setMostSoldItem] = useState({});
  const [leastSoldItem, setLeastSoldItem] = useState({});
  const [mostSalesHour, setMostSalesHour] = useState("");
  const [leastSalesHour, setLeastSalesHour] = useState("");
  const [discountHours, setDiscountHours] = useState(0);
  const [discountItems, setDiscountItems] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch dashboard data
  // useEffect(() => {
  //   axios.get("/api/admindis/dashboard")
  //     .then(response => {
  //       const data = response.data;
  //       setSalesData(data.hourlySales);
  //       setItemSalesData(data.itemSales);
  //       setMostSalesHour(data.mostSalesHour);
  //       setLeastSalesHour(data.leastSalesHour);
  //       setMostSoldItem(data.mostSoldItem);
  //       setLeastSoldItem(data.leastSoldItem);
  //       setDiscountHours(data.discountedHours);
  //       setDiscountItems(data.discountedItems);
  //     })
  //     .catch(err => console.error(err));
  // }, []);

  // Apply discount now function
  const handleDiscountNow = (type) => {
    axios
      .post("/api/discount/apply-discount", { type })
      .then((response) => {
        setMessage(`Discount applied successfully for ${type} items.`);
        // Refetch updated data
        axios.get("/api/admindis/dashboard").then((res) => {
          setSalesData(res.data.hourlySales);
          setDiscountItems(res.data.discountedItems);
        });
      })
      .catch((err) => setMessage(`Error applying discount: ${err.message}`));
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
    labels: itemSalesData.map((item) => item.name),
    datasets: [
      {
        label: "Sales per Item",
        data: itemSalesData.map((item) => item.sales),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Function to check if discount time has passed
  const isDiscountCompleted = (discountHour) => {
    const currentHour = new Date().getHours();
    return currentHour >= discountHour;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Admin Dashboard
        </h1>

        {/* Hourly Sales for Current Day */}
        <Card className="p-6 mb-8">
          <Typography variant="h5" className="text-gray-800 mb-4">
            Hourly Sales (for Upcoming Day)
          </Typography>
          <Line data={hourlySalesChartData} />
          <Typography variant="h6" className="text-gray-600 mt-4">
            Most Sales Hour (Upcoming Day): {mostSalesHour}
          </Typography>
          <Typography variant="h6" className="text-gray-600 mt-2">
            Least Sales Hour (Upcoming Day): {leastSalesHour}
          </Typography>
        </Card>

        {/* Items with their Sales for Current Day */}
        <Card className="p-6 mb-8">
          <Typography variant="h5" className="text-gray-800 mb-4">
            Items with Sales (for Upcoming Day)
          </Typography>
          <Line data={itemSalesChartData} />
          <Typography variant="h6" className="text-gray-600 mt-4">
            {/* Most Sold Item: {mostSoldItem.name} ({mostSoldItem.sales} sales) */}
          </Typography>
          <Typography variant="h6" className="text-gray-600 mt-2">
            {/* Least Sold Item: {leastSoldItem.name} ({leastSoldItem.sales} sales) */}
          </Typography>
        </Card>

        {/* Current Day's Discounting Hours */}
        <Card className="p-6 mb-8">
          <Typography variant="h5" className="text-gray-800 mb-4">
            Discounting Hours (Current Day)
          </Typography>
          <Typography variant="h6" className="text-gray-600 mb-4">
            {/* Most Sales Hour (Previous Day): {discountHours} */}
          </Typography>
          <Button
            color="green"
            // disabled={isDiscountCompleted(discountHours)}
            onClick={() => handleDiscountNow("hour")}
          >
            Apply Discount Now (Most Sold Hour)
          </Button>
        </Card>

        {/* Current Day's Discounting Items */}
        <Card className="p-6 mb-8">
          <Typography variant="h5" className="text-gray-800 mb-4">
            Discounting Items (Current Day)
          </Typography>
          {/* {discountItems.map(item => (
            <Typography key={item.item_id} variant="h6" className="text-gray-600 mb-2">
              {item.name}: {item.sales} sales (Discount: {item.discount_percentage}%)
            </Typography>
          ))} */}
        </Card>

        {message && <p className="text-sm text-red-500 mt-8">{message}</p>}
      </div>
    </div>
  );
};

export default Dashboard;
