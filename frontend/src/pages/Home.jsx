import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardBody, Typography } from '@material-tailwind/react';

const URL = 'http://localhost:3001/Products/products';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(URL);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="mt-16 flex flex-wrap justify-center">
        {products.length > 0 && products.map((product) => (
          <Link key={product._id} to={`/product/${product._id}`}>
            <Card className="bg-white shadow-md rounded-lg overflow-hidden" style={{ width: '300px',height: '425px', margin: '15px', padding: '4px' }}>
              <CardBody style={{ padding: '10px', height: 'calc(100% - 40px)' }}>
                <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-48 h-48 object-cover"
                    style={{ borderRadius: '8px', height: '250px', width: '270px', marginTop: '15px' }}
                  />
                </div>
                <Typography variant="h6" className="mt-4 text-left font-semibold" style={{ color: "black" }}>
                  {product.productName}
                </Typography>
                <Typography variant="body2" className="mt-2 text-left truncate" style={{ color: "gray" }}>
                  {product.description} 
                </Typography>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-gray-400" style={{ fontWeight: 'bold', fontSize: '16px' ,color:'gray'}}>
                    {product.quantity} pcs
                  </div>
                  <div className="flex flex-col items-end">
              {product.discount ? (
                <>
                  {/* Display discounted price above original price */}
                  <div className="text-red-500" style={{ fontWeight: 'bold', fontSize: '16px' ,marginBottom: '2px' }}>
                    ${product.displayed_price.toFixed(2)}
                  </div>
                  {/* Display original price crossed out */}
                  <div className="text-gray-500" style={{ textDecoration: 'line-through', fontWeight: 'bold', fontSize: '16px', marginTop: '-4px' ,marginBottom: '10px'}}>
                    ${product.price.toFixed(2)}
                  </div>
                </>
              ) : (
                // Display regular price if no discount
                <div className="text-black" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  ${product.price.toFixed(2)}
                </div>
              )}
            </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
