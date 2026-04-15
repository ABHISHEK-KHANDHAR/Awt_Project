import { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const CartPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // Simplified logic leveraging local storage state for Cart
  useEffect(() => {
    const fetchAndAddToCart = async () => {
      let currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      if (id) {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
          const itemToAdd = {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty: qty
          };
          const existItem = currentCart.find((x) => x.product === itemToAdd.product);

          if (existItem) {
            currentCart = currentCart.map((x) => {
              if (x.product === existItem.product) {
                let newQty = x.qty + itemToAdd.qty;
                if (newQty > data.countInStock) newQty = data.countInStock;
                return { ...itemToAdd, qty: itemToAdd.qty };
              }
              return x;
            });
          } else {
            currentCart = [...currentCart, itemToAdd];
          }
          localStorage.setItem('cartItems', JSON.stringify(currentCart));
          setCartItems(currentCart);
        } catch (error) {
          console.error(error);
        }
        // clear ID from url so refresh doesn't trigger reapplying cart
        navigate('/cart', { replace: true });
      } else {
        setCartItems(currentCart);
      }
    };
    fetchAndAddToCart();
  }, [id, qty, navigate]);

  const removeFromCartHandler = (id) => {
    const currentCart = cartItems.filter(x => x.product !== id);
    setCartItems(currentCart);
    localStorage.setItem('cartItems', JSON.stringify(currentCart));
  };

  const clearCartHandler = () => {
    setCartItems([]);
    setSelectedItems([]);
    localStorage.removeItem('cartItems');
  };

  const deleteSelectedHandler = () => {
    const currentCart = cartItems.filter(x => !selectedItems.includes(x.product));
    setCartItems(currentCart);
    setSelectedItems([]);
    localStorage.setItem('cartItems', JSON.stringify(currentCart));
  };

  const toggleSelection = (productId) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter(id => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  const checkoutHandler = () => {
    let itemsToCheckout = cartItems;
    if (selectedItems.length > 0) {
      itemsToCheckout = cartItems.filter(x => selectedItems.includes(x.product));
    }
    localStorage.setItem('checkoutItems', JSON.stringify(itemsToCheckout));
    
    // Check if user is logged in
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  return (
    <Row>
      <Col md={8}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Shopping Cart</h2>
          <div>
            {selectedItems.length > 0 && (
              <Button variant="outline-warning" onClick={deleteSelectedHandler} size="sm" className="me-2">
                <i className="fas fa-trash me-1"></i> Delete Selected
              </Button>
            )}
            {cartItems.length > 0 && (
              <Button variant="outline-danger" onClick={clearCartHandler} size="sm">
                <i className="fas fa-trash-alt me-1"></i> Clear Cart
              </Button>
            )}
          </div>
        </div>
        {cartItems.length === 0 ? (
          <div className="alert alert-info">
             Your cart is empty <Link to="/">Go Back</Link>
          </div>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row className="align-items-center">
                  <Col md={1}>
                    <Form.Check 
                      type="checkbox" 
                      checked={selectedItems.includes(item.product)}
                      onChange={() => toggleSelection(item.product)}
                    />
                  </Col>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) => {
                        navigate(`/cart/${item.product}?qty=${e.target.value}`)
                      }}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2} className="text-end">
                    <Button type="button" variant="light" onClick={() => removeFromCartHandler(item.product)}>
                      <i className="fas fa-times"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
              </h4>
              ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item className="d-grid gap-2">
              <Button type="button" disabled={cartItems.length === 0} onClick={checkoutHandler}>
                {selectedItems.length > 0 ? `Checkout Selected (${selectedItems.length})` : 'Proceed To Checkout'}
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartPage;
