import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Input,
  Button,
  Textarea,
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";

// Function to generate a unique product ID with 'PROD-' prefix and 6 numeric characters
const generateProductId = () => {
  const randomPart = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
  return `PROD${randomPart}`;
};

function AddProduct() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    productId: "",
    productName: "",
    description: "",
    price: "",
    quantity: "",
    color: "",
    size: "",
    discount: "false", // Default value
    discount_percentage: "0", // Default value
    image: "",
    displayed_price: "0", // Default value
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    // Generate a product ID when the component mounts
    setInputs((prevState) => ({
      ...prevState,
      productId: generateProductId(),
    }));
  }, []);

  const validate = () => {
    const newErrors = {};
    // Check for empty fields and specific validations
    if (!inputs.productName) newErrors.productName = "Product name is required";
    if (!inputs.description) newErrors.description = "Description is required";
    if (!inputs.price) newErrors.price = "Price is required";
    if (inputs.price < 0) newErrors.price = "Price cannot be negative";
    if (!inputs.quantity) newErrors.quantity = "Quantity is required";
    if (inputs.quantity < 0) newErrors.quantity = "Quantity cannot be negative";
    if (!inputs.color) newErrors.color = "Color is required";
    if (!inputs.size) newErrors.size = "Size is required";
    if (!inputs.discount) newErrors.discount = "Discount status is required";
    if (inputs.discount_percentage < 0 || inputs.discount_percentage > 100)
      newErrors.discount_percentage =
        "Discount percentage must be between 0 and 100";
    if (!inputs.image) newErrors.image = "Image is required";
    if (!inputs.displayed_price)
      newErrors.displayed_price = "Displayed price is required";
    if (inputs.discount !== "true" && inputs.discount !== "false")
      newErrors.discount = "Discount must be true or false";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputs((prevState) => ({
          ...prevState,
          image: reader.result, // Set the data URL as the image value
        }));
        setImagePreview(reader.result); // Set the image preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      sendRequest().then(() => {
        alert("Product added successfully!"); // Alert message on successful addition
        history("/products");
      });
    }
  };

  const sendRequest = async () => {
    await axios
      .post("http://localhost:3001/Products/product-add", {
        productId: String(inputs.productId),
        productName: String(inputs.productName),
        description: String(inputs.description),
        price: Number(inputs.price),
        quantity: Number(inputs.quantity),
        color: String(inputs.color),
        size: String(inputs.size),
        discount: inputs.discount === "true",
        discount_percentage: Number(inputs.discount_percentage),
        image: String(inputs.image),
        displayed_price: Number(inputs.displayed_price),
      })
      .then((res) => res.data);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      ></div>
      <div
        style={{
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontWeight: "bold",
            color: "black",
            fontSize: "20px",
          }}
        >
          Add New Product
        </h2>
        <Card
          className="w-full p-6 shadow-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(10px)",
          }}
        >
          <CardBody>
            <form onSubmit={handleSubmit}>
              <div style={{ marginTop: "5px", marginBottom: "15px" }}>
                <label
                  htmlFor="productId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product ID
                </label>
                <Input
                  type="text"
                  name="productId"
                  value={inputs.productId}
                  readOnly
                  style={{ marginTop: "5px", marginBottom: "15px" }}
                />
              </div>

              <div style={{ marginTop: "5px", marginBottom: "15px" }}>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Name
                </label>
                <Input
                  label="Product Name"
                  type="text"
                  name="productName"
                  onChange={handleChange}
                  value={inputs.productName}
                  required
                  style={{ marginTop: "5px", marginBottom: "5px" }}
                />
                {errors.productName && (
                  <p className="text-red-500">{errors.productName}</p>
                )}
              </div>

              <div style={{ marginTop: "5px", marginBottom: "15px" }}>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <Textarea
                  label="Description"
                  name="description"
                  onChange={handleChange}
                  value={inputs.description}
                  required
                  style={{ marginTop: "5px", marginBottom: "15px" }}
                />
                {errors.description && (
                  <p className="text-red-500">{errors.description}</p>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "15px",
                  marginBottom: "15px",
                }}
              >
                <div style={{ flex: "1 1 20%" }}>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price
                  </label>
                  <Input
                    label="Price"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    name="price"
                    min="0" // Prevents negative values
                    onChange={handleChange}
                    value={inputs.price}
                    required
                    style={{ fontSize: "small", marginBottom: "5px" }}
                  />
                  {errors.price && (
                    <p className="text-red-500">{errors.price}</p>
                  )}
                </div>

                <div style={{ flex: "1 1 20%" }}>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Quantity
                  </label>
                  <Input
                    label="Quantity"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    name="quantity"
                    min="0" // Prevents negative values
                    onChange={handleChange}
                    value={inputs.quantity}
                    required
                    style={{ fontSize: "small", marginBottom: "5px" }}
                  />
                  {errors.quantity && (
                    <p className="text-red-500">{errors.quantity}</p>
                  )}
                </div>

                <div style={{ flex: "1 1 20%" }}>
                  <label
                    htmlFor="color"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Color
                  </label>
                  <Input
                    label="Color"
                    type="text"
                    name="color"
                    onChange={handleChange}
                    value={inputs.color}
                    required
                    style={{ fontSize: "small", marginBottom: "5px" }}
                  />
                  {errors.color && (
                    <p className="text-red-500">{errors.color}</p>
                  )}
                </div>

                <div style={{ flex: "1 1 20%" }}>
                  <label
                    htmlFor="size"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Size
                  </label>
                  <Input
                    label="Size"
                    type="text"
                    name="size"
                    onChange={handleChange}
                    value={inputs.size}
                    required
                    style={{ fontSize: "small", marginBottom: "5px" }}
                  />
                  {errors.size && <p className="text-red-500">{errors.size}</p>}
                </div>

                <div style={{ flex: "1 1 20%" }}>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Discount
                  </label>
                  <Input
                    type="text"
                    name="discount"
                    onChange={handleChange}
                    value={inputs.discount}
                    required
                    style={{ fontSize: "small", marginBottom: "5px" }}
                  />
                  {errors.discount && (
                    <p className="text-red-500">{errors.discount}</p>
                  )}
                </div>

                <div style={{ flex: "1 1 20%" }}>
                  <label
                    htmlFor="discount_percentage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Discount Percentage
                  </label>
                  <Input
                    type="number"
                    name="discount_percentage"
                    onWheel={(e) => e.target.blur()}
                    min="0" // Prevents negative values
                    max="100" // Ensures percentage does not exceed 100
                    onChange={handleChange}
                    value={inputs.discount_percentage}
                    required
                    style={{ fontSize: "small", marginBottom: "5px" }}
                  />
                  {errors.discount_percentage && (
                    <p className="text-red-500">{errors.discount_percentage}</p>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="displayed_price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Image
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ marginTop: "5px", marginBottom: "15px" }}
                />
                {imagePreview && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
                {errors.image && <p className="text-red-500">{errors.image}</p>}
              </div>

              <div style={{ marginTop: "5px", marginBottom: "15px" }}>
                <label
                  htmlFor="displayed_price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Displayed Price
                </label>
                <Input
                  type="number"
                  name="displayed_price"
                  onWheel={(e) => e.target.blur()}
                  min="0" // Prevents negative values
                  onChange={handleChange}
                  value={inputs.displayed_price}
                  required
                  style={{ marginTop: "5px", marginBottom: "5px" }}
                />
                {errors.displayed_price && (
                  <p className="text-red-500">{errors.displayed_price}</p>
                )}
              </div>

              <Button
                type="submit"
                style={{
                  backgroundColor: "#248FDD",
                  color: "#fff",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  margin: "0 auto",
                  display: "block",
                }}
              >
                Add Product
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default AddProduct;
