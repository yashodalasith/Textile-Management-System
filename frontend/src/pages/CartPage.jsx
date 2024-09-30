import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Card,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import api from "../../api";
import { Link, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

const TABLE_HEAD = [
  "Product Name",
  "Price",
  "Quantity",
  "Selling Price",
  "Discounted",
  "Final price",
  "",
];

const baseUrl = "http://localhost:3001/cart";
const baseUrl1 = "http://localhost:3001/order";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoading, setShowLoading] = useState(true); // Track if loading spinner should be shown
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false); // Toggle edit mode
  const [updatedCart, setUpdatedCart] = useState([]);
  const [openOrderConfirm, setOpenOrderConfirm] = useState(false); // State for order confirmation dialog
  const startTimeRef = useRef(Date.now());
  const userId = localStorage.getItem("userId");
  const [openConfirm, setOpenConfirm] = useState(false); // State for confirmation dialog
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleNavigate = () => {
    setOpen(false);
    navigate("/confirm-order");
  };

  const handleOrderConfirmation = () => {
    setOpenOrderConfirm(true); // Open the order confirmation dialog
  };
  const confirmMakeOrder = async () => {
    await handleMakeOrder(); // Call the original make order function
    setOpenOrderConfirm(false); // Close the confirmation dialog
  };
  const handleDoneEditing = async () => {
    try {
      // Send updated cart to the backend
      const response = await axios.put(`${baseUrl}/update-quantities`, {
        userId,
        updatedCart,
      });

      if (response.status === 200) {
        setCart(updatedCart); // Update the local cart with new quantities
        setEditMode(false); // Exit edit mode
        console.log("Cart updated successfully");
      } else {
        alert(response.data.message || "Failed to update cart.");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("An error occurred while updating the cart.");
    }
  };

  const handleQuantityChange = (index, operation) => {
    setUpdatedCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity:
                operation === "increase"
                  ? item.quantity + 1
                  : item.quantity > 1
                  ? item.quantity - 1
                  : 1, // Prevent quantity from going below 1
            }
          : item
      )
    );
  };
  const handleMakeOrder = async () => {
    try {
      const response = await axios.post(`${baseUrl1}/confirm-order`, {
        userId,
      });

      if (response.status === 200) {
        setOpen(true);
        console.log("Order details:", response.data);
      } else {
        setOpen(true);
        alert(response.data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Cart is Empty.");
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await axios.delete(`${baseUrl}/clear`, {
        data: { userId },
      });

      if (response.status === 200) {
        console.log(response.data);
      } else {
        alert(response.data.message || "Failed to clear cart.");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("An error occurred clearing the cart.");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await axios.delete(`${baseUrl}/remove-item`, {
        data: { userId, productId },
      });

      if (response.status === 200) {
        setCart(response.data.cart); // Update the cart
        window.location.reload();
      } else {
        alert(response.data.message || "Failed to remove item.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleRemoveConfirmation = (productId) => {
    setItemToRemove(productId); // Set the item to remove
    setOpenConfirm(true); // Open the confirmation dialog
  };

  const confirmRemoveItem = async () => {
    if (itemToRemove) {
      await handleRemoveItem(itemToRemove); // Call the original remove function
      setOpenConfirm(false); // Close the confirmation dialog
    }
  };
  useEffect(() => {
    const fetchCart = async () => {
      startTimeRef.current = Date.now(); // Track the start time
      try {
        if (!userId) {
          throw new Error("User ID not found.");
        }

        const response = await api.get(`/cart/${userId}`);
        setCart(response.data.items);
        setUpdatedCart(response.data.items);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch cart");
      } finally {
        // Ensure loading spinner is shown for at least 1 second
        setTimeout(() => {
          setLoading(false);
          setShowLoading(false);
        }, Math.max(1000 - (Date.now() - startTimeRef.current), 0));
      }
    };
    fetchCart();
  }, [userId]);

  return (
    <div>
      {showLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
          <div className="flex flex-col ">
            <div className="animate-spin rounded-full h-2 w-16 border-t-4 border-blue-500 border-solid"></div>
            <p className="mt-4 text-lg font-semibold text-black z-60">
              Loading...
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-between">
        <div>
          <img
            src="https://static.vecteezy.com/system/resources/previews/000/356/583/original/vector-shopping-cart-icon.jpg"
            alt="product"
            style={{ width: "2cm", height: "2cm" }}
            className="p-4"
          />
        </div>
        <div className=" text-center text-3xl mt-4">My cart</div>
        <Link to={"/home"}>
          <button className="mr-4 text-center text-sm mt-4 ">Add more</button>
        </Link>
      </div>
      {cart.length > 0 && !editMode ? (
        <Button
          className="flex justify-end mr-4 ml-4 mb-2"
          onClick={() => setEditMode(true)}
        >
          Edit Cart
        </Button>
      ) : null}
      <div className="flex justify-start mt-4 ml-4 mb-1">
        <Link to={"/OrdersDoneByTheUser"}>
          <Button>view previous orders</Button>
        </Link>
      </div>

      <div className="flex justify-between">
        <div>
          <img
            src="https://ahmedstextiles.co.za/wp-content/uploads/2017/08/fabrics-36.jpg"
            alt="product"
            style={{ width: "6cm", height: "10cm" }}
            className="p-4"
          />
        </div>
        {!loading && (
          <Card className="h-full w-auto overflow-scroll shadow-2xl p-5 border rounded-lg">
            {cart.length === 0 ? (
              <div>
                <div>
                  <p className="text-center text-lg font-semibold text-gray-500">
                    Your cart is empty.
                  </p>
                </div>

                <div className="flex justify-center p-4">
                  <Link to={"/home"}>
                    <Button>Shop Items</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-100 bg-black p-4"
                      >
                        <Typography
                          variant="big"
                          color="white"
                          className="font-sans leading-none opacity-70 mt-4"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="shadow-2xl">
                  {updatedCart.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Link
                          to={`http://localhost:5173/product/${item.productId}`}
                        >
                          {" "}
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold mt-4 p-4"
                          >
                            {item.productName || "N/A"}
                          </Typography>
                        </Link>
                      </td>
                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal mt-4 p-4"
                        >
                          ${item.price}
                        </Typography>
                      </td>
                      <td>
                        {!editMode ? (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal mt-4 p-4"
                          >
                            {item.quantity}
                          </Typography>
                        ) : (
                          <div className="flex items-center mt-4">
                            <button
                              onClick={() =>
                                handleQuantityChange(index, "decrease")
                              }
                              className="px-2 py-1 bg-gray-300 rounded-md"
                            >
                              -
                            </button>
                            <span className="mx-4">{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(index, "increase")
                              }
                              className="px-2 py-1 bg-gray-300 rounded-md"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </td>
                      {/* <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal mt-4 p-4"
                        >
                          {item.quantity}
                        </Typography>
                      </td> */}
                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal mt-4 p-4"
                        >
                          ${item.displayed_price.toFixed(2)}
                        </Typography>
                      </td>
                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal mt-4 p-4"
                        >
                          {item.discount ? "Yes" : "No"}
                        </Typography>
                      </td>
                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold mt-4 p-4"
                        >
                          ${(item.displayed_price * item.quantity).toFixed(2)}
                        </Typography>
                      </td>
                      <td>
                        <Typography
                          as="a"
                          href="#"
                          variant="small"
                          color="red"
                          className="font-medium mt-4 p-4"
                        >
                          <Link to={"/cart"}>
                            <button
                              className="text-red-700"
                              onClick={() =>
                                handleRemoveConfirmation(item.productId)
                              }
                            >
                              Remove Item
                            </button>
                            <Dialog
                              open={openConfirm}
                              handler={() => setOpenConfirm(false)}
                            >
                              <DialogBody>
                                <p>
                                  Do you wish to completely remove this item?
                                </p>
                              </DialogBody>
                              <DialogFooter>
                                <Button
                                  className="mr-4"
                                  color="red"
                                  onClick={() => setOpenConfirm(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  color="green"
                                  onClick={confirmRemoveItem}
                                >
                                  Confirm
                                </Button>
                              </DialogFooter>
                            </Dialog>
                          </Link>
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {cart.length > 0 &&
              !editMode && ( // Hide this section when in edit mode
                <div className="flex justify-between mt-4">
                  <div>
                    <button
                      className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                      onClick={handleOrderConfirmation}
                    >
                      Make order
                    </button>
                    <Dialog
                      open={openOrderConfirm}
                      handler={() => setOpenOrderConfirm(false)}
                    >
                      <DialogBody>
                        <p>Do you really want to place this order?</p>
                      </DialogBody>
                      <DialogFooter>
                        <Button
                          className="mr-4"
                          color="red"
                          onClick={() => setOpenOrderConfirm(false)}
                        >
                          Cancel
                        </Button>
                        <Button color="green" onClick={confirmMakeOrder}>
                          Confirm
                        </Button>
                      </DialogFooter>
                    </Dialog>
                    <Dialog open={open} handler={() => setOpen(false)}>
                      <DialogBody>
                        <p>Order placed successfully!</p>
                      </DialogBody>
                      <DialogFooter>
                        <Button
                          className="bg-blue-500 text-white"
                          onClick={handleNavigate}
                        >
                          Confirm Order
                        </Button>
                      </DialogFooter>
                    </Dialog>
                  </div>
                  <div>
                    <Link to={"/home"}>
                      <button
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                        onClick={handleCancelOrder}
                      >
                        Cancel
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            {editMode && (
              <div className="flex justify-center mt-4">
                <Button
                  style={{
                    height: "40px",
                    width: "120px",
                    justifyContent: "center",
                    marginRight: "1rem",
                    marginLeft: "1rem",
                    marginBottom: "0.5rem",
                  }}
                  onClick={handleDoneEditing}
                >
                  Done
                </Button>
              </div>
            )}
          </Card>
        )}

        <div>
          <img
            src="https://wallpaperaccess.com/full/4597148.jpg"
            alt="product"
            style={{ width: "6cm", height: "10cm" }}
            className="p-4"
          />
        </div>
      </div>

      <div className="flex justify-between m-4"></div>
    </div>
  );
}
