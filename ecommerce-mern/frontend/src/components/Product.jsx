import { Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Product = ({ product }) => {
  const navigate = useNavigate();

  const addToCartHandler = () => {
    navigate(`/cart/${product._id}?qty=1`);
  };

  return (
    <Card className="p-3 rounded shadow-sm hover-overlay d-flex flex-column h-100 border-0" style={{ transition: 'transform 0.2s' }}>
      <Link to={`/product/${product._id}`} className="text-decoration-none text-reset">
        <div className="d-flex align-items-center justify-content-center bg-light position-relative overflow-hidden" style={{ height: '250px', borderRadius: '0.75rem' }}>
          {product.category && (
            <span className="badge bg-secondary position-absolute top-0 start-0 m-2 text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
              {product.category}
            </span>
          )}
          <Card.Img
            variant="top"
            src={product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjIxMCIgZmlsbD0iI2IyYjJiMiIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIxMCIvPjxyZWN0IHg9IjYwIiB5PSI4MCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiM5OTk5OTkiIHJ4PSIxMCIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE0MCIgcj0iMTUiIGZpbGw9IiNmZmYiLz48dGV4dCB4PSIxNTAiIHk9IjE5MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2Ij5JbWFnZSBOb3QgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='}
            alt={product.name || 'Product image'}
            style={{ objectFit: 'contain', height: '100%', width: '100%' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjIxMCIgZmlsbD0iI2IyYjJiMiIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIxMCIvPjxyZWN0IHg9IjYwIiB5PSI4MCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiM5OTk5OTkiIHJ4PSIxMCIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE0MCIgcj0iMTUiIGZpbGw9IiNmZmYiLz48dGV4dCB4PSIxNTAiIHk9IjE5MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2Ij5JbWFnZSBOb3QgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        </div>
      </Link>
      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card.Title as="h5" className="mb-2">
            {product.name}
          </Card.Title>
        </Link>
        <Card.Text className="text-muted mb-3" style={{ minHeight: '3rem', fontSize: '0.95rem' }}>
          {product.description?.length > 85 ? `${product.description.substring(0, 85)}...` : product.description}
        </Card.Text>
        <div className="d-flex align-items-center justify-content-between mt-auto pt-2">
          <div>
            <Card.Text as="h5" className="text-primary mb-1">
              ${product.price}
            </Card.Text>
            <small className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
              {product.countInStock > 0 ? 'In stock' : 'Out of stock'}
            </small>
          </div>
          <Button
            className="ms-2"
            variant="primary"
            disabled={product.countInStock === 0}
            onClick={addToCartHandler}
          >
            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;
