import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const URL = "http://localhost:3001/Products/products";
const DELETE_URL = "http://localhost:3001/Products/products-delete";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const isValidProduct = (product) => {
  return (
    product &&
    typeof product.productId === "string" &&
    typeof product.productName === "string" &&
    typeof product.description === "string" &&
    typeof product.price === "number" &&
    typeof product.quantity === "number" &&
    typeof product.color === "string" &&
    typeof product.size === "string" &&
    typeof product.image === "string" &&
    typeof product.discount === "boolean" &&
    (typeof product.discount_percentage === "number" ||
      product.discount_percentage === null)
  );
};

function ViewProducts() {
  const [products, setViewProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null); // State to track the expanded product
  const navigate = useNavigate();

  useEffect(() => {
    fetchHandler().then((data) => {
      if (Array.isArray(data)) {
        const validProducts = data.filter(isValidProduct);
        setViewProducts(validProducts);
      } else {
        console.error("Unexpected data format:", data);
        setViewProducts([]);
      }
    });
  }, []);

  const handleUpdate = (productId) => {
    navigate(`/update-product/${productId}`);
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${DELETE_URL}/${productId}`);
      setViewProducts(
        products.filter((product) => product.productId !== productId)
      );
      navigate("/products");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  const toggleDetails = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  const generateReport = () => {
    const reportContent = `
      <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h2>Products Report</h2>
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Color</th>
              <th>Size</th>
              <th>Discount</th>
              <th>Discount Percentage</th>
               <th>Displayed Price</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (product) =>
                  `<tr key=${product.productId}>
                <td>${product.productId}</td>
                <td>${product.productName}</td>
                <td>${product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td>${product.color}</td>
                <td>${product.size}</td>
                <td>${product.discount ? "Yes" : "No"}</td>
                <td>${product.discount_percentage || 0}%</td>
               <td>${
                 product.displayed_price
                   ? product.displayed_price.toFixed(2)
                   : product.price.toFixed(2)
               }</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write(reportContent);
    reportWindow.document.close();
    reportWindow.print();
  };

  return (
    <div className="relative p-6">
      {/* Add Product Button */}
      <div className="absolute top-6 left-6 mb-20 flex space-x-4">
        <Button
          onClick={handleAddProduct}
          color="green"
          className="flex items-center space-x-2"
        >
          <span>Add Product</span>
        </Button>
        <Button
          onClick={generateReport}
          color="green"
          className="flex items-center space-x-2"
          style={{ marginLeft: "4px" }}
        >
          <span>Generate Report</span>
        </Button>
      </div>

      <br />
      <br />
      {/* Container for product cards */}
      <div className="mt-16 flex flex-wrap justify-center">
        {products.length > 0 &&
          products.map((product) => (
            <Card
              key={product.productId}
              className="bg-white shadow-md rounded-lg overflow-hidden"
              style={{
                width: "300px",
                margin: "15px",
                padding: "4px",

                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Increased shadow size
              }}
            >
              <CardBody style={{ padding: "10px" }}>
                {" "}
                {/* Adjust padding here */}
                <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-48 h-48 object-cover"
                    style={{
                      borderRadius: "8px",
                      height: "250px",
                      width: "270px",
                      marginTop: "15px",
                    }}
                  />
                </div>
                {/* Product Name */}
                <Typography
                  variant="h6"
                  className="mt-4 text-center font-semibold"
                  style={{ color: "black" }}
                >
                  {product.productName}
                </Typography>
                <div className="mt-2">
                  <Typography variant="body2" className="text-left text-sm">
                    {product.productId}
                  </Typography>
                  <div className="flex justify-between items-center mb-1">
                    <Typography variant="body2" className="text-left text-sm">
                      {" "}
                      {/* Removed boldness */}
                      {product.color}
                    </Typography>
                    <Typography variant="body2" className="text-sm">
                      <div
                        className="inline-block px-2 py-1 bg-white border border-gray-300 rounded"
                        style={{
                          borderRadius: "4px",
                          minWidth: "80px",
                          textAlign: "center",
                        }}
                      >
                        {product.size}
                      </div>
                    </Typography>
                  </div>

                  <Typography
                    variant="body2"
                    color="gray"
                    className="mb-2 text-left text-l truncate"
                  >
                    {product.description}
                  </Typography>

                  <div
                    className="flex justify-between items-center mb-1"
                    style={{ marginTop: "5px" }}
                  >
                    {/* Quantity */}
                    <div
                      className="inline-block px-2 py-1 bg-white border border-gray-300 rounded"
                      style={{
                        borderRadius: "4px",
                        minWidth: "80px",
                        textAlign: "center",
                      }}
                    >
                      {product.quantity} pcs
                    </div>

                    {/* Price */}
                    <div
                      className="inline-block px-2 py-1 bg-white border border-gray-300 rounded"
                      style={{
                        borderRadius: "4px",
                        minWidth: "80px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "black",
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Conditionally rendered details */}
                  {expandedProductId === product.productId && (
                    <div className="mt-4">
                      <Typography
                        variant="body2"
                        className="mb-2 text-left text-sm"
                      >
                        Discount: {product.discount ? "Yes" : "No"}
                      </Typography>
                      <Typography variant="body2" className="mb-2 text-sm">
                        Discount Percentage: {product.discount_percentage || 0}%
                      </Typography>
                      <Typography
                        variant="body2"
                        className="mb-2 text-left text-sm"
                      >
                        Discounted Price: $
                        {product.displayed_price
                          ? product.displayed_price.toFixed(2)
                          : product.price.toFixed(2)}
                      </Typography>
                    </div>
                  )}

                  {/* See More as clickable text */}
                  <Typography
                    onClick={() => toggleDetails(product.productId)}
                    className="cursor-pointer text-gray-500 mt-2"
                  >
                    {expandedProductId === product.productId
                      ? "See Less"
                      : "See More"}
                  </Typography>
                </div>
              </CardBody>
              <CardFooter className="p-0 flex items-center justify-between px-3 pb-6">
                <Button
                  onClick={() => handleUpdate(product._id)}
                  className="flex items-center p-3 justify-center w-1/2 bg-white border border-gray-500 text-gray-700 hover:bg-gray-100"
                >
                  <PencilIcon className="w-5 h-5 mr-2 text-gray-700" />{" "}
                  {/* Edit icon */}
                  Update
                </Button>
                <Button
                  onClick={() => handleDelete(product._id)}
                  className="flex items-center p-3 justify-center w-1/2 bg-white border border-red-500 text-red-500 hover:bg-red-50"
                >
                  <TrashIcon className="w-5 h-5 mr-2 text-red-500" />{" "}
                  {/* Delete icon */}
                  Delete
                </Button>
              </CardFooter>
              <br />
            </Card>
          ))}
      </div>
    </div>
  );
}

export default ViewProducts;
