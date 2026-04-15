import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col, Row, Card, ListGroup, Image } from 'react-bootstrap';
import axios from 'axios';
import Message from '../components/Message';

const CheckoutPage = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('GPay');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('checkoutItems')) || JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
    
    // Check if user is logged in
    const userInfo = sessionStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    }
  }, [navigate]);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

  const placeOrderHandler = async () => {
    // Validate required fields
    if (!address || !city || !postalCode || !country || !mobileNumber) {
      setError('Please fill in all shipping information fields');
      return;
    }

    if (paymentMethod === 'BankCard') {
      if (!cardName || !cardNumber || !expiryDate || !cvv) {
        setError('Please fill in all card details');
        return;
      }
    }

    try {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/login');
        return;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const orderData = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country, mobileNumber },
        paymentMethod: paymentMethod,
        totalPrice
      };

      await axios.post('http://localhost:5000/api/orders', orderData, config);
      
      setSuccess(true);
      
      // Clean up cart correctly: Only remove the items we actually just bought
      let fullCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      fullCart = fullCart.filter(item => !cartItems.find(purchased => purchased.product === item.product));
      localStorage.setItem('cartItems', JSON.stringify(fullCart));
      
      localStorage.removeItem('checkoutItems');
      setCartItems([]);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  if (success) {
    return (
      <div className="text-center py-5 mt-5">
        <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '6rem', dropShadow: '0 4px 6px rgba(0,0,0,0.1)' }}></i>
        <h2 className="text-success fw-bold mb-3">Order Placed Successfully!</h2>
        <p className="text-muted mb-3 fs-5">
          Thank you for shopping with us. Your payment via {paymentMethod === 'GPay' ? 'Google Pay' : paymentMethod === 'BankCard' ? 'Bank Card' : 'QR Scanner'} has been processed securely.
        </p>
        <p className="text-muted mb-5">Order confirmation will be sent to your registered email address.</p>
        <Button 
          variant="primary" 
          size="lg" 
          className="rounded-pill px-5 py-3 fw-bold shadow" 
          onClick={() => navigate('/')}
        >
          <i className="fas fa-home me-2"></i> Return to Home / Cards
        </Button>
      </div>
    );
  }

  return (
    <Row>
      <Col md={8}>
        <h2>Shipping Data</h2>
        <Form className="mb-4">
          <Form.Group controlId="address" className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" placeholder="Enter address" value={address} required onChange={(e) => setAddress(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="city" className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" placeholder="Enter city" value={city} required onChange={(e) => setCity(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="postalCode" className="mb-3">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control type="text" placeholder="Enter postal code" value={postalCode} required onChange={(e) => setPostalCode(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="country" className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Control type="text" placeholder="Enter country" value={country} required onChange={(e) => setCountry(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="mobileNumber" className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control type="tel" placeholder="Enter mobile number" value={mobileNumber} required onChange={(e) => setMobileNumber(e.target.value)} />
          </Form.Group>
        </Form>

        <h3>Payment Method</h3>
        <Form className="mb-4">
          <Form.Check 
            type="radio" 
            label={<span><i className="fab fa-google-pay fs-5 align-middle me-2" style={{color: '#4285F4'}}></i>Google Pay (GPay)</span>}
            id="GPay" 
            name="paymentMethod" 
            value="GPay" 
            checked={paymentMethod === 'GPay'} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
            className="mb-2"
          />
          <Form.Check 
            type="radio" 
            label={<span><i className="fas fa-credit-card fs-5 align-middle me-2" style={{color: '#F4B400'}}></i>Bank Card</span>}
            id="BankCard" 
            name="paymentMethod" 
            value="BankCard" 
            checked={paymentMethod === 'BankCard'} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
            className="mb-2"
          />
          <Form.Check 
            type="radio" 
            label={<span><i className="fas fa-qrcode fs-5 align-middle me-2" style={{color: '#0F9D58'}}></i>Scanner to Pay</span>}
            id="Scanner" 
            name="paymentMethod" 
            value="Scanner" 
            checked={paymentMethod === 'Scanner'} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
          />
        </Form>

        {paymentMethod === 'BankCard' && (
          <Card className="mb-4 p-3">
            <h4>Card Details</h4>
            <Form>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="cardName">
                    <Form.Label>Cardholder Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter cardholder name" 
                      value={cardName} 
                      onChange={(e) => setCardName(e.target.value)} 
                      required={paymentMethod === 'BankCard'}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="cardNumber">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber} 
                      onChange={(e) => setCardNumber(e.target.value)} 
                      required={paymentMethod === 'BankCard'}
                      maxLength="19"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="expiryDate">
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="MM/YY" 
                      value={expiryDate} 
                      onChange={(e) => setExpiryDate(e.target.value)} 
                      required={paymentMethod === 'BankCard'}
                      maxLength="5"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="cvv">
                    <Form.Label>CVV</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="123" 
                      value={cvv} 
                      onChange={(e) => setCvv(e.target.value)} 
                      required={paymentMethod === 'BankCard'}
                      maxLength="4"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card>
        )}

        {paymentMethod === 'GPay' && (
          <Card className="mb-4 p-3 bg-light">
            <div className="text-center">
              <i className="fab fa-google-pay fs-1 text-primary mb-3"></i>
              <h5>Google Pay</h5>
              <p className="text-muted">You will be redirected to Google Pay for secure payment processing.</p>
            </div>
          </Card>
        )}

        {paymentMethod === 'Scanner' && (
          <Card className="mb-4 p-3 bg-light">
            <div className="text-center">
              <i className="fas fa-qrcode fs-1 text-success mb-3"></i>
              <h5>QR Code Payment</h5>
              <p className="text-muted">Scan the QR code at checkout to complete your payment.</p>
            </div>
          </Card>
        )}

        <h3>Order Items</h3>
        {cartItems.length === 0 ? <Message>Your cart is empty</Message> : (
          <ListGroup variant="flush">
            {cartItems.map((item, index) => (
              <ListGroup.Item key={index}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col>
                    {item.name}
                  </Col>
                  <Col md={4}>
                    {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
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
              <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total</Col>
                <Col>${totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            {error && <ListGroup.Item><Message variant="danger">{error}</Message></ListGroup.Item>}
            <ListGroup.Item className="d-grid gap-2">
              <Button type="button" disabled={cartItems.length === 0} onClick={placeOrderHandler}>
                Place Order
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CheckoutPage;
