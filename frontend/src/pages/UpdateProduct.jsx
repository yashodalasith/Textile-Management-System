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
          image: reader.result,
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => navigate('/products'));
  };

  const sendRequest = async () => {
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
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '20px' }}>
      </div>
      <div style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', marginBottom: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 'bold', color: 'black',fontsize:'20px' }}>Update Product</h2>
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
                    type="number"
                    name="price"
                    onChange={handleChange}
                    value={inputs.price}
                    style={{ fontSize: 'small', marginBottom: '5px' }}
                  />
                </div>

                <div style={{ flex: '1 1 20%' }}>
                  <Input
                    label="Quantity"
                    type="number"
                    name="quantity"
                    onChange={handleChange}
                    value={inputs.quantity}
                    style={{ fontSize: 'small', marginBottom: '5px' }}
                  />
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
                  type="number"
                  name="displayed_price"
                  onChange={handleChange}
                  value={inputs.displayed_price}
                  style={{ marginTop: '5px', marginBottom: '5px' }}
                />
              </div>

              <Button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', borderRadius: '5px', padding: '10px 20px', margin: '0 auto', display: 'block' }}>
                Update Product
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default UpdateProduct;