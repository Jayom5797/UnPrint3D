import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';
import OrderDetailsForm from '../components/OrderDetailsForm';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, emptyCart } = useCart();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [completedOrderId, setCompletedOrderId] = useState<number | null>(null);
  const navigate = useNavigate();

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
      navigate('/login');
      return;
    }

    setLoading(true);
    setMessage('');

    const total_price = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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
        price_at_purchase: item.price,
        color: item.color,
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (orderItemsError) throw orderItemsError;

      // Step 3: Clear cart and show success
      emptyCart();
      setCompletedOrderId(orderData.id);
    } catch (error: any) {
      setMessage(`Error placing order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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
        completedOrderId ? (
          <div className="order-success-container">
            <div className="success-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2>Thank You for Your Order!</h2>
            <p>Your order has been placed successfully.</p>
            <p className="order-id">Order ID: #{completedOrderId}</p>
            <p>You can optionally share your contact and shipping details below. We'll also email you a confirmation.</p>
            {completedOrderId && (
              <div className="mt-6 w-full">
                <OrderDetailsForm orderId={completedOrderId} onDone={() => { /* optional: navigate or clear */ }} />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p>Your cart is currently empty.</p>
            {message && <p className={`mt-4 text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
          </div>
        )
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={`${item.id}-${item.color}`} className="cart-item">
                <img 
                  src={
                    item.product_images?.find(img => img.image_url.toLowerCase().includes(item.color.toLowerCase()))?.image_url || 
                    item.product_images?.[0]?.image_url || 
                    '/placeholder.png'
                  } 
                  alt={item.title} 
                  className="cart-item-image" 
                />
                <div className="cart-item-details">
                  <h2>{item.title}</h2>
                  <p>Color: {item.color}</p>
                  <p>Price: ₹{item.price.toFixed(2)}</p>
                  <div className="cart-item-quantity">
                    <label>Quantity:</label>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, item.color, parseInt(e.target.value, 10))}
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
              {!session && <p className="mt-2 text-sm text-red-600">Please <Link to="/login" className="font-bold underline">log in</Link> to place an order.</p>}
              {message && <p className={`mt-2 text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;