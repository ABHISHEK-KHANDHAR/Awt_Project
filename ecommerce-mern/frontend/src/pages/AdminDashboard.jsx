import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap';
import axios from '../utils/api';
import Message from '../components/Message';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    
    if (userInfo && userInfo.isAdmin) {
      fetchProducts();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        };
        await axios.delete(`/api/products/${id}`, config);
        fetchProducts();
      } catch (err) {
        alert(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    }
  };

  const createProductHandler = async () => {
    try {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      await axios.post(`/api/products`, {}, config);
      fetchProducts();
    } catch (err) {
      alert(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h2>Admin Dashboard - Products</h2>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm shadow-sm">
          <thead className="bg-dark text-white">
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand || 'N/A'}</td>
                <td className="text-center">
                  <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}>
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default AdminDashboard;
