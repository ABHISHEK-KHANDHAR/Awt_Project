import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ userInfo, logoutHandler }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header>
      <Navbar variant="light" expand="lg" collapseOnSelect className="glass-navbar sticky-top">
        <Container>
          <div className="d-flex align-items-center">
            {location.pathname !== '/' && (
              <Button 
                variant="link" 
                onClick={() => navigate(-1)} 
                className="text-dark p-0 me-3 rounded-circle hover-overlay d-flex align-items-center justify-content-center"
                style={{ width: '35px', height: '35px', textDecoration: 'none', background: 'rgba(0,0,0,0.05)' }}
                title="Go Back"
              >
                <i className="fas fa-arrow-left"></i>
              </Button>
            )}
            <LinkContainer to="/">
              <Navbar.Brand className="brand-gradient" style={{ cursor: 'pointer' }}><i className="fas fa-shopping-bag me-2"></i>Shivam Store</Navbar.Brand>
            </LinkContainer>
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              
              {/* 1) Home Button First */}
              <div className="d-flex align-items-center me-3 pe-3 border-end">
                <LinkContainer to="/">
                  <Nav.Link className="nav-link-custom fw-bold" style={{ color: '#4a90e2' }}>
                    <i className="fas fa-home me-1"></i> Home
                  </Nav.Link>
                </LinkContainer>
              </div>

              {/* 2) Cart Button Second */}
              <div className="d-flex align-items-center me-4">
                <LinkContainer to="/cart">
                  <Nav.Link className="nav-link-custom fw-bold text-success"><i className="fas fa-shopping-cart border-none shadow-none pe-1"></i> Cart</Nav.Link>
                </LinkContainer>
              </div>
              
              {/* 3) Logout and Username Last */}
              {userInfo ? (
                <div className="d-flex align-items-center">
                  {userInfo.isAdmin && (
                    <LinkContainer to="/admin">
                      <Nav.Link className="nav-link-custom text-secondary me-3">Admin</Nav.Link>
                    </LinkContainer>
                  )}
                  <Nav.Link onClick={logoutHandler} className="nav-link-custom fw-bold text-danger me-4">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </Nav.Link>
                  <div className="avatar mb-0 shadow" title={userInfo.name} style={{ marginRight: 0 }}>
                    {userInfo.name ? userInfo.name.charAt(0) : 'U'}
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <LinkContainer to="/login">
                    <Nav.Link className="nav-link-custom fw-bold"><i className="fas fa-user"></i> Sign In</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link className="nav-link-custom ms-2 fw-bold btn btn-outline-primary rounded-pill px-4" style={{border: '2px solid #4a90e2', color: '#4a90e2'}}>Register</Nav.Link>
                  </LinkContainer>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
