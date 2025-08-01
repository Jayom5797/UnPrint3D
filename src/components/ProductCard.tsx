import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  price: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, image, title, description, price }) => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate(`/product/${id}`);
  };
  

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
            <button onClick={handleShopNow} className="button">Shop Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;








