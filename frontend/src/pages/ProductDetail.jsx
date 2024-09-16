import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const URL = "http://localhost:3001/Products/products";
const CART_URL = "http://localhost:3001/cart/add";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // State to hold the selected quantity
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const userId = "mockUser123"; // Replace with the actual user ID
      const {
        _id: productId,
        productName,
        price,
        displayed_price,
        discount,
      } = product;

      // Send the product details along with quantity to the backend
      const response = await axios.post(CART_URL, {
        userId,
        productId,
        productName,
        quantity: Number(quantity), // Ensure quantity is a number
        price,
        displayed_price,
        discount,
      });

      if (response.status === 200) {
        navigate("/home"); // Redirect to the desired page after adding to cart
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div
        className="bg-white rounded-lg shadow-lg flex relative"
        style={{
          width: "800px",
          height: "500px",
          border: "1px solid #e5e7eb",
        }}
      >
        <div className="w-1/2 p-4 flex items-center justify-center">
          {product.image && (
            <img
              src={product.image}
              alt={product.productName}
              className="object-cover rounded-lg"
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "400px",
                maxHeight: "500px",
              }}
            />
          )}
        </div>

        <div className="w-1/2 p-4 flex flex-col justify-start relative">
          <h1 className="text-5xl font-bold mb-4">{product.productName}</h1>

          <div className="mt-4">
            {product.discount ? (
              <div className="flex flex-col">
                <div className="flex items-center mb-1">
                  <p className="text-red-500 text-2xl font-bold mr-5">
                    ${product.displayed_price.toFixed(2)}
                  </p>
                  <p
                    className="text-gray-500 text-xl font-bold"
                    style={{ textDecoration: "line-through" }}
                  >
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-gray-700 text-lg mt-1">Discounted Price</p>
              </div>
            ) : (
              <p className="text-black-700 text-2xl font-bold">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>

          <div className="relative mt-2" style={{ height: "3px" }}>
            <div
              className="absolute bottom-0 left-0"
              style={{
                width: "300px",
                marginRight: "20px",
                borderBottom: "2px solid #e5e7eb",
                marginTop: "2px",
              }}
            ></div>
          </div>

          <p className="text-gray-500 text-2xl mt-2">{product.description}</p>

          {product.color && (
            <p className="text-gray-700 mt-2 text-l">Colour: {product.color}</p>
          )}
          {product.size && (
            <p className="text-gray-700 mt-2 text-l">
              Available Size: {product.size}
            </p>
          )}

          <div
            className="left-4 flex items-center space-x-2"
            style={{ marginTop: "30px" }}
          >
            {product.discount && <p className="text-gray-700 mt-2">{product.discount}</p>}

            {/* Quantity Selector and Add to Cart Button */}
            <div className="left-4 flex items-center space-x-2" style={{ marginTop: '30px' }}>
              <select
                id="quantity"
                name="quantity"
                className="border border-gray-300 p-2 text-lg text-center"
                style={{ width: "50px", height: "35px" }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>

              <button
                className="text-white text-lg"
                style={{
                  padding: "5px 0",
                  width: "150px",
                  backgroundColor: "#072445",
                  borderRadius: "0",
                }}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// const URL = "http://localhost:3001/Products/products";
// const CART_URL = "http://localhost:3001/cart/add";

// const ProductDetail = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1); // State to hold the selected quantity
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(`${URL}/${id}`);
//         setProduct(response.data);
//       } catch (error) {
//         console.error("Error fetching product details:", error);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const handleAddToCart = async () => {
//     try {
//       const userId = "mockUser123"; // Replace with the actual user ID
//       const {
//         _id: productId,
//         productName,
//         price,
//         displayed_price,
//         discount,
//       } = product;

//       // Send the product details along with quantity to the backend
//       const response = await axios.post(CART_URL, {
//         userId,
//         productId,
//         productName,
//         quantity,
//         price,
//         displayed_price,
//         discount,
//       });

//       if (response.status === 200) {
//         navigate("/home"); // Redirect to the cart page if needed
//       }
//     } catch (error) {
//       console.error("Failed to add item to cart:", error);
//     }
//   };

//   if (!product) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
//       <div
//         className="bg-white rounded-lg shadow-lg flex relative"
//         style={{
//           width: "800px",
//           height: "500px",
//           border: "1px solid #e5e7eb",
//         }}
//       >
//         <div className="w-1/2 p-4 flex items-center justify-center">
//           <img
//             src={product.image}
//             alt={product.productName}
//             className="object-cover rounded-lg"
//             style={{
//               width: "100%",
//               height: "100%",
//               maxWidth: "400px",
//               maxHeight: "500px",
//             }}
//           />
//         </div>

//         <div className="w-1/2 p-4 flex flex-col justify-start relative">
//           <h1 className="text-5xl font-bold mb-4">{product.productName}</h1>

//           <div className="mt-4">
//             {product.discount ? (
//               <div className="flex flex-col">
//                 <div className="flex items-center mb-1">
//                   <p className="text-red-500 text-2xl font-bold mr-5">
//                     ${product.displayed_price.toFixed(2)}
//                   </p>
//                   <p
//                     className="text-gray-500 text-xl font-bold"
//                     style={{ textDecoration: "line-through" }}
//                   >
//                     ${product.price.toFixed(2)}
//                   </p>
//                 </div>
//                 <p className="text-gray-700 text-lg mt-1">Discounted Price</p>
//               </div>
//             ) : (
//               <p className="text-black-700 text-2xl font-bold">
//                 ${product.price.toFixed(2)}
//               </p>
//             )}
//           </div>

//           <div className="relative mt-2" style={{ height: "3px" }}>
//             <div
//               className="absolute bottom-0 left-0"
//               style={{
//                 width: "300px",
//                 marginRight: "20px",
//                 borderBottom: "2px solid #e5e7eb",
//                 marginTop: "2px",
//               }}
//             ></div>
//           </div>

//           <p className="text-gray-500 text-2xl mt-2">{product.description}</p>

//           {product.color && (
//             <p className="text-gray-700 mt-2 text-l">Colour: {product.color}</p>
//           )}
//           {product.size && (
//             <p className="text-gray-700 mt-2 text-l">
//               Available Size: {product.size}
//             </p>
//           )}

//           <div
//             className="left-4 flex items-center space-x-2"
//             style={{ marginTop: "30px" }}
//           >
//           {product.discount && (
//             <p className="text-gray-700 mt-2">
//               {product.discount}
//             </p>
//           )}

//           {/* Button for navigating to cart */}
//           <div className=" left-4 flex items-center space-x-2" style={{marginTop: '30px'}}>
//             <select
//               id="quantity"
//               name="quantity"
//               className="border border-gray-300 p-2 text-lg text-center"
//               style={{ width: "50px", height: "35px" }}
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//             >
//               <option value="1">1</option>
//               <option value="2">2</option>
//               <option value="3">3</option>
//               <option value="4">4</option>
//               <option value="5">5</option>
//             </select>

//             <button
//               className="text-white text-lg"
//               style={{
//                 padding: "5px 0",
//                 width: "150px",
//                 backgroundColor: "#072445",
//                 borderRadius: "0",
//               }}
//               onClick={handleAddToCart}
//             >
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;
