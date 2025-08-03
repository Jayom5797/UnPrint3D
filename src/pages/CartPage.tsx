import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, emptyCart } = useCart();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCheckout = async () => {
    if (!session?.user) {
      setMessage('You must be logged in to checkout.');
      return;
    }

    setLoading(true);
    setMessage('');

    const total_price = cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('₹', ''));
      return total + price * item.quantity;
    }, 0);

    try {
      // Step 1: Create an order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: session.user.id,
          total_price: total_price,
          status: 'Pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Step 2: Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: parseFloat(item.price.replace('₹', '')),
        color: item.color,
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (orderItemsError) throw orderItemsError;

      // Step 3: Clear cart and show success
      emptyCart();
      setMessage('Order placed successfully!');
    } catch (error: any) {
      setMessage(`Error placing order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.-]/g, '')) : item.price;
    return total + price * item.quantity;
  }, 0);

  return (
    <div className="cart-page">
      <div className="top-page-buttons">
        <Link to="/shop" className="continue-shopping-btn">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Continue Shopping
        </Link>
        <button onClick={emptyCart} className="empty-cart-btn">
          Empty Cart
        </button>
      </div>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <h2>{item.title}</h2>
                  <p>Color: {item.color}</p>
                  <p>Price: ₹{(typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.-]/g, '')) : item.price).toFixed(2)}</p>
                  <div className="cart-item-quantity">
                    <label>Quantity:</label>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                      min="1"
                    />
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.color)} className="remove-btn">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Cart Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
                      <div className="mt-4 flex flex-col items-center">
            <button 
              onClick={handleCheckout}
              disabled={!session || loading || cartItems.length === 0}
              className="checkout-btn w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            {!session && <p className="mt-2 text-sm text-red-600">Please log in to place an order.</p>}
            {message && <p className={`mt-2 text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
