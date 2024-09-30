import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Input,
  Button,
  Textarea,
  Card,
  CardBody,
} from '@material-tailwind/react';

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    productId: "",
    productName: "",
    description: "",
    price: "",
    quantity: "",
    color: "",
    size: "",
    discount: "false",
    discount_percentage: "0",
    image: "",
    displayed_price: "0",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Products/products/${id}`);
        setInputs(response.data);
        setImagePreview(response.data.image);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the field is meant to be a number and handle it appropriately
    const numericValue =
      name === 'price' || name === 'quantity' || name === 'discount_percentage' || name === 'displayed_price'
        ? value === "" ? "" : Number(value) // Check if value is empty, if so keep it empty
        : value;
  
    setInputs((prevState) => ({
      ...prevState,
      [name]: numericValue,
    }));
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputs((prevState) => ({
          ...prevState,
          image: reader.result,
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (inputs.quantity !== "" && inputs.quantity < 0) newErrors.quantity = "Quantity cannot be negative"; // Only validate if not empty
    if (inputs.price !== "" && inputs.price < 0) newErrors.price = "Price cannot be negative"; // Only validate if not empty
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    sendRequest().then(() => {
      alert('Product updated successfully'); // Add this line to show a Windows-style alert
      navigate('/products');
    });
  };
  
  

  const sendRequest = async () => {
    try {
      await axios.put(`http://localhost:3001/Products/products-update/${id}`, {
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
      });
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  
  const handleCancel = () => {
    navigate('/products');
  };


  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '20px' }}>
      </div>
      <div style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', marginBottom: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 'bold', color: 'black', fontSize: '20px' }}>Update Product</h2>
        <Card className="w-full p-6 shadow-lg">
          <CardBody>
            <form onSubmit={handleSubmit}>
              <div style={{ marginTop: '5px', marginBottom: '15px' }}>
                <Input
                  label="Product ID"
                  type="text"
                  name="productId"
                  value={inputs.productId}
                  readOnly
                  style={{ marginTop: '5px', marginBottom: '15px' }}
                />
              </div>

              <div style={{ marginTop: '5px', marginBottom: '15px' }}>
                <Input
                  label="Product Name"
                  type="text"
                  name="productName"
                  onChange={handleChange}
                  value={inputs.productName}
                  style={{ marginTop: '5px', marginBottom: '5px' }}
                />
              </div>

              <div style={{ marginTop: '5px', marginBottom: '15px' }}>
                <Textarea
                  label="Description"
                  name="description"
                  onChange={handleChange}
                  value={inputs.description}
                  style={{ marginTop: '5px', marginBottom: '15px' }}
                />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: '1 1 20%' }}>
                  <Input
                    label="Price"
                    onWheel={(e) => e.target.blur()}
                    type="number"
                    name="price"
                    onChange={handleChange}
                    value={inputs.price}
                    style={{ fontSize: 'small', marginBottom: '5px' }}
                  />
                  {errors.price && <p style={{ color: 'red', fontSize: '12px' }}>{errors.price}</p>}
                </div>

                <div style={{ flex: '1 1 20%' }}>
                  <Input
                    label="Quantity"
                    onWheel={(e) => e.target.blur()}
                    type="number"
                    name="quantity"
                    onChange={handleChange}
                    value={inputs.quantity}
                    style={{ fontSize: 'small', marginBottom: '5px' }}
                  />
                  {errors.quantity && <p style={{ color: 'red', fontSize: '12px' }}>{errors.quantity}</p>}
                </div>

                <div style={{ flex: '1 1 20%' }}>
                  <Input
                    label="Color"
                    type="text"
                    name="color"
                    onChange={handleChange}
                    value={inputs.color}
                    style={{ fontSize: 'small', marginBottom: '5px' }}
                  />
                </div>

                <div style={{ flex: '1 1 20%' }}>
                  <Input
                    label="Size"
                    type="text"
                    name="size"
                    onChange={handleChange}
                    value={inputs.size}
                    style={{ fontSize: 'small', marginBottom: '5px' }}
                  />
                </div>

                <div style={{ flex: '1 1 20%' }}>
                  <Input
                    label="Discount"
                    type="text"
                    name="discount"
                    onChange={handleChange}
                    value={inputs.discount}
                    style={{ fontSize: 'small', marginBottom: '5px' }}
                  />
                </div>

                <div style={{ flex: '1 1 20%' }}>
                  <Input
                    label="Discount Percentage"
                    onWheel={(e) => e.target.blur()}
                    type="number"
                    name="discount_percentage"
                    onChange={handleChange}
                    value={inputs.discount_percentage}
                    style={{ fontSize: 'small', marginBottom: '5px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ marginTop: '5px', marginBottom: '15px' }}
                />
                {imagePreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ marginTop: '5px', marginBottom: '15px' }}>
                <Input
                  label="Displayed Price"
                  onWheel={(e) => e.target.blur()}
                  type="number"
                  name="displayed_price"
                  onChange={handleChange}
                  value={inputs.displayed_price}
                  style={{ marginTop: '5px', marginBottom: '5px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <Button type="submit" style={{ backgroundColor: '#248FDD', color: '#fff', borderRadius: '5px', padding: '10px 20px' }}>
                  Update Product
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  style={{ backgroundColor: '#d3d3d3', color: '#000', borderRadius: '5px', padding: '10px 20px' }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default UpdateProduct;
