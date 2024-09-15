import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const URL = 'http://localhost:3001/Products/products';

const ProductDetail = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`); 
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Loading...</p>; // Handle loading state
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div
        className="bg-white rounded-lg shadow-lg flex relative"
        style={{
          width: '800px', // Fixed container width
          height: '500px', // Fixed container height
          border: '1px solid #e5e7eb', // Tailwind's border-gray-300
        }}
      >
        {/* Left Side: Product Image */}
        <div className="w-1/2 p-4 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.productName}
            className="object-cover rounded-lg"
            style={{ width: '100%', height: '100%', maxWidth: '400px', maxHeight: '500px' }}
          />
        </div>

        {/* Right Side: Product Details */}
        <div className="w-1/2 p-4 flex flex-col justify-start relative">
          <h1 className="text-5xl font-bold mb-4">{product.productName}</h1>
          
          {/* Conditional Rendering for Price */}
          <div className="mt-4">
            {product.discount ? (
              <div className="flex flex-col">
                {/* Display discounted price */}
                <div className="flex items-center mb-1">
                  <p className="text-red-500 text-2xl font-bold mr-5">
                    ${product.displayed_price.toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-xl font-bold" style={{ textDecoration: 'line-through' }}>
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                {/* Discounted Price Label */}
                <p className="text-gray-700 text-lg mt-1">
                  Discounted Price
                </p>
              </div>
            ) : (
              <p className="text-black-700 text-2xl font-bold">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>

          {/* Horizontal Line */}
          <div className="relative mt-2" style={{ height: '3px' }}>
            <div
              className="absolute bottom-0 left-0"
              style={{
                width: '300px', // Line width adjusted
                marginRight: '20px', // Margin from right
                borderBottom: '2px solid #e5e7eb',
                marginTop: '2px', // Line style
              }}
            ></div>
          </div>

          <p className="text-gray-500 text-2xl mt-2">
            {product.description}
          </p>

          {product.color && (
            <p className="text-gray-700 mt-2 text-l">
              Colour: {product.color}
            </p>
          )}
          {product.size && (
            <p className="text-gray-700 mt-2 text-l">
              Available Size: {product.size}
            </p>
          )}
          {product.discount && (
            <p className="text-gray-700 mt-2">
              {product.discount}
            </p>
          )}

          {/* Button for navigating to cart */}
          <div className=" left-4 flex items-center space-x-2" style={{marginTop: '30px'}}>
            <select
              id="quantity"
              name="quantity"
              className="border border-gray-300 p-2 text-lg text-center"
              style={{ width: '50px', height: '35px' }}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            {/* Go to Cart Button */}
            <button
              className="text-white text-lg"
              style={{ padding: '5px 0', width: '150px', backgroundColor: '#072445', borderRadius: '0' }}
              onClick={() => navigate('')} // Navigate to the cart page
            >
              Add to Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
