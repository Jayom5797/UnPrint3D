import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Product, ProductColor, ProductImage } from '../types'; 
import ColorPicker from '../components/ColorPicker';
import { useCart } from '../context/CartContext';
import './ProductPage.css';

const ProductPage: React.FC = () => {
  const { addToCart } = useCart();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images ( * ),
            product_colors ( * )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          // Construct full public URLs for each image
          const processedData = {
            ...data,
            product_images: data.product_images.map((img: ProductImage) => ({
              ...img,
              image_url: supabase.storage.from('product-images').getPublicUrl(img.image_url).data.publicUrl
            })),
          };
          setProduct(processedData as Product);

          // Set initial selected image and color
          if (processedData.product_images && processedData.product_images.length > 0) {
            setSelectedImage(processedData.product_images[0].image_url);
          }
          if (processedData.product_colors && processedData.product_colors.length > 0) {
            setSelectedColor(processedData.product_colors[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!product) {
    return <div className="loading-container">Product not found</div>;
  }

  return (
    <div className="product-page">
      <div className="left-column">
        <div className="image-gallery">
          <div className="thumbnails">
            {product.product_images.map((img, index) => (
              <div 
                key={index} 
                className={`thumbnail-item ${img.image_url === selectedImage ? 'active' : ''}`}
                onMouseEnter={() => setSelectedImage(img.image_url)}
              >
                <img src={img.image_url} alt={`${product.title} thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="main-image">
            <img src={selectedImage} alt={product.title} />
          </div>
        </div>
      </div>
      <div className="right-column">
        <div className="top-page-buttons">
          <Link to="/shop" className="back-to-shop-btn">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Shop
          </Link>
          <Link to="/cart" className="go-to-cart-btn">
            Go to Cart
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        <h1 className="product-title">{product.title}</h1>
        <p>{product.description}</p>
        <div className="price-section">
            <span className="price-amount">₹{product.price.toFixed(2)}</span>
        </div>
        {product.product_colors && product.product_colors.length > 0 && (
          <div className="color-selection">
            <p>Color: <strong>{selectedColor?.name}</strong></p>
            <ColorPicker colors={product.product_colors} onColorSelect={setSelectedColor} />
          </div>
        )}
        <div className="quantity-selector">
          <p>Quantity</p>
          <div className="quantity-controls">
            <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange(1)}>+</button>
          </div>
        </div>
        <div className="action-buttons">
          <button 
            className="btn btn-add-to-cart"
            onClick={() => {
              if (product) {
                const colorToAdd = (product.product_colors && product.product_colors.length > 0) ? selectedColor?.name : 'Default';
                if (colorToAdd) {
                  addToCart(product, quantity, colorToAdd);
                }
              }
            }}
            disabled={!product || (product.product_colors && product.product_colors.length > 0 && !selectedColor)}
          >
            Add to Cart
          </button>
          <button className="btn btn-buy-now">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
