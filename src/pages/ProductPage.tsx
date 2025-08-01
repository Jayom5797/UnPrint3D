import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { products } from './ShoppingPage'; // We'll get the data from here for now
import { Product } from '../types';
import ColorPicker from '../components/ColorPicker';
import './ProductPage.css';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product: Product | undefined = products.find(p => p.id === Number(id));
  const [selectedImage, setSelectedImage] = useState(product?.images[0]);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string; } | null>(product?.colors ? product.colors[0] : null);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-page">
      <div className="left-column">
        <div className="image-gallery">
          <div className="thumbnails">
            {product.images.map((img, index) => (
              <div 
                key={index} 
                className={`thumbnail-item ${img === selectedImage ? 'active' : ''}`}
                onMouseEnter={() => setSelectedImage(img)}
              >
                <img src={img} alt={`${product.title} thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="main-image">
            <img src={selectedImage} alt={product.title} />
          </div>
        </div>
      </div>
      <div className="right-column">
        <h1 className="product-title">{product.title}</h1>
        <p>{product.description}</p>
        <div className="price-section">
            <span className="price-amount">{product.price}</span>
        </div>
        {product.colors && (
          <div className="color-selection">
            <p>Color: <strong>{selectedColor?.name}</strong></p>
            <ColorPicker colors={product.colors} onColorSelect={setSelectedColor} />
          </div>
        )}
        <div className="action-buttons">
          <button className="btn btn-add-to-cart">Add to Cart</button>
          <button className="btn btn-buy-now">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
