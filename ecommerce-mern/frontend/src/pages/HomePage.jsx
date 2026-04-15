import { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const userInfo = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <h1 className="mb-4">Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : products.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-shopping-bag fa-4x text-muted mb-3"></i>
          <h3 className="text-muted">No Products Available</h3>
          <p className="text-muted">Products will be added soon. Please check back later.</p>
        </div>
      ) : (
        <>
          <Row className="g-5">
            {userInfo 
              ? products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))
              : products.slice(0, 12).map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))
            }
          </Row>
          {!userInfo && products.length > 12 && (
            <div className="d-flex justify-content-center mt-5 mb-4 p-4 rounded text-center" style={{ background: 'rgba(74, 144, 226, 0.05)', border: '1px dashed rgba(74, 144, 226, 0.3)' }}>
              <div>
                <h4 className="mb-3 text-secondary">Want to see more amazing products?</h4>
                <Button 
                  href="/login"
                  variant="primary" 
                  size="lg" 
                  className="rounded-pill px-5 fw-bold shadow-sm">
                  Sign In to View All {products.length} Products
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default HomePage;
