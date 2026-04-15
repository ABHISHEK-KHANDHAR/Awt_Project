import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';

import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check local storage for user info on initial load
    const storedUser = sessionStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const logoutHandler = () => {
    sessionStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  return (
    <>
      <Header userInfo={userInfo} logoutHandler={logoutHandler} />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart/:id?" element={<CartPage />} />
            <Route path="/login" element={<LoginPage setUserInfo={setUserInfo} />} />
            <Route path="/register" element={<RegisterPage setUserInfo={setUserInfo} />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Container>
      </main>
      <footer className="text-center py-3 text-muted">
        &copy; {new Date().getFullYear()} MERN E-Commerce. All Rights Reserved.
      </footer>
    </>
  );
}

export default App;
