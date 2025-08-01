import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  price: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, image, title, description, price }) => {
  

  return (
    <div className="product-card-wrapper">
      <div className="product-card-content">
        <div className="product-image-wrapper">
          <img src={image} alt={title} className="product-image" />
        </div>
        <div className="product-info-container">
          <h3 className="product-title">{title}</h3>
          <p className="product-description">{description}</p>
          <div className="product-price-button-wrapper">
            <span className="product-price">{price}</span>
            <Link to={`/product/${id}`} className="button">Shop Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;








