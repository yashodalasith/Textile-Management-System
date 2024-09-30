import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardFooter, Typography, Button, Input } from '@material-tailwind/react';
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const URL = 'http://localhost:3001/Products/products';
const DELETE_URL = 'http://localhost:3001/Products/products-delete';

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

const isValidProduct = (product) => {
  return (
    product &&
    typeof product.productId === 'string' &&
    typeof product.productName === 'string' &&
    typeof product.description === 'string' &&
    typeof product.price === 'number' &&
    typeof product.quantity === 'number' &&
    typeof product.color === 'string' &&
    typeof product.size === 'string' &&
    typeof product.image === 'string' &&
    typeof product.discount === 'boolean' &&
    (typeof product.discount_percentage === 'number' || product.discount_percentage === null)
  );
};

function ViewProducts() {
  const [products, setViewProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHandler().then((data) => {
      if (Array.isArray(data)) {
        const validProducts = data.filter(isValidProduct);
        setViewProducts(validProducts);
      } else {
        console.error('Unexpected data format:', data);
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
      setViewProducts(products.filter(product => product.productId !== productId));
      alert('Product deleted successfully!'); // Alert message after successful deletion
      navigate('/products');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  

  const handleAddProduct = () => {
    navigate('/add-product');
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
            ${products.map((product) => (
              `<tr key=${product.productId}>
                <td>${product.productId}</td>
                <td>${product.productName}</td>
                <td>${product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td>${product.color}</td>
                <td>${product.size}</td>
                <td>${product.discount ? 'Yes' : 'No'}</td>
                <td>${product.discount_percentage || 0}%</td>
               <td>${product.displayed_price ? product.displayed_price.toFixed(2) : product.price.toFixed(2)}</td>
              </tr>`
            )).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(reportContent);
    reportWindow.document.close();
    reportWindow.print();
  };

  const filteredProducts = products.filter(product =>
    product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.quantity.toString().includes(searchTerm) ||
    product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.price.toString().includes(searchTerm)
  );

  return (
<div className="relative p-6">
  <div className="flex items-center justify-between mb-20">
    <Typography variant="h6" className="text-black text-lg font-semibold"style={{ fontSize: '25px' }}>
      Admin Dashboard
    </Typography>
    <div className="flex items-center space-x-4">
      <div style={{ position: 'relative', width: '500px',marginRight: '10px'  }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 40px 8px 16px',
            border: '1px solid grey',
            fontSize: '16px'
          }}
        />
        <div style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}>
          <MagnifyingGlassIcon style={{ height: '20px', width: '20px', color: '#9CA3AF' }} aria-hidden="true" />
        </div>
      </div>
      <Button
        onClick={handleAddProduct}
        className="flex items-center space-x-2 bg-white border border-gray-300 text-black"
      >
        <span>Add Product</span>
      </Button>
      <Button
        onClick={generateReport}
        className="flex items-center space-x-2 bg-white border border-gray-300 text-black ml-1"
      >
        <span>Generate Report</span>
      </Button>
    </div>
  </div>
  {/* Rest of your content */}

  <br />
  <br />


      <div className="mt-16 flex flex-wrap justify-center">
        {filteredProducts.length > 0 && filteredProducts.map((product) => (
          <Card
            key={product.productId}
            className="bg-white shadow-md rounded-lg overflow-hidden"
            style={{ 
              width: '300px', 
              margin: '15px', 
              padding: '4px', 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            <CardBody style={{ padding: '10px' }}>
              <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                <img
                  src={product.image}
                  alt={product.productName}
                  className="w-48 h-48 object-cover"
                  style={{ borderRadius: '8px', height: '250px', width: '270px', marginTop: '15px' }}
                />
              </div>

              <Typography variant="h6" className="mt-4 text-center font-semibold"style={{color:"black"}}>
                {product.productName}
              </Typography>

              <div className="mt-2">
                <Typography variant="body2" className="text-left text-sm">
                  {product.productId}
                </Typography>
                <div className="flex justify-between items-center mb-1">
                  <Typography variant="body2" className="text-left text-sm">
                    {product.color} 
                  </Typography>
                  <Typography variant="body2" className="text-sm">
                    <div className="inline-block px-2 py-1 bg-white border border-gray-150 rounded" style={{ borderRadius: '4px', minWidth: '80px', textAlign: 'center' }}>
                      {product.size}
                    </div>
                  </Typography>
                </div>

                <Typography variant="body2" color="gray" className="mb-2 text-left text-l truncate">
                  {product.description}
                </Typography>
                
                <div className="flex justify-between items-center mb-1"  style={{ marginTop: '5px' }}>
                  <div className="inline-block px-2 py-1 bg-white border border-gray-150 rounded" style={{ borderRadius: '4px', minWidth: '80px', textAlign: 'center' }}>
                    {product.quantity} pcs
                  </div>
                  <div className="inline-block px-2 py-1 bg-white border border-gray-150 rounded" style={{ borderRadius: '4px', minWidth: '80px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                {expandedProductId === product.productId && (
                 <div className="mt-4">
                 <Typography variant="body2" className="text-left text-sm text-black mb-1" style={{ fontSize: '15px' }}> 
                   Discount
                 </Typography>
                 <div className="flex justify-between items-center mb-5"style={{ marginTop: '5px' }}> 
                   <Typography variant="body2" className="text-left text-sm">
                     {product.discount ? 'Yes' : 'No'} 
                   </Typography>
                   <Typography variant="body2" className="text-right text-sm"> 
                     {product.discount_percentage || 0}%
                   </Typography>
                 </div>
                 <Typography variant="body2" className="mb-2 text-left text-sm" style={{ marginTop: '5px' }}>
                   Discounted Price: ${product.displayed_price ? product.displayed_price.toFixed(2) : product.price.toFixed(2)}
                 </Typography>
               </div>
               
               
                )}

                <Typography
                  onClick={() => toggleDetails(product.productId)}
                  className="cursor-pointer text-gray-500 mt-2"
                >
                  {expandedProductId === product.productId ? 'See Less' : 'See More'}
                </Typography>

              </div>
            </CardBody>
            <CardFooter className="p-0 flex items-center justify-between px-3 pb-6">
              <Button
                onClick={() => handleUpdate(product._id)}
                className="flex items-center p-3 justify-center w-1/2 bg-white border border-gray-500 text-gray-700 hover:bg-gray-100"
              >
                <PencilIcon className="w-5 h-5 mr-2 text-gray-700" />
                Update
              </Button>
              <Button
                onClick={() => handleDelete(product._id)}
                className="flex items-center p-3 justify-center w-1/2 bg-white border border-red-500 text-red-500 hover:bg-red-50"
              >
                <TrashIcon className="w-5 h-5 mr-2 text-red-500" />
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