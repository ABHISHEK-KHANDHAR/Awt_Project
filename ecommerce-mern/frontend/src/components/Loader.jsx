import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
      <Spinner
        animation="border"
        role="status"
        variant="primary"
        style={{ width: '60px', height: '60px' }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <div className="mt-3 text-primary fw-bold" style={{ fontSize: '1.2rem' }}>Loading...</div>
    </div>
  );
};

export default Loader;
