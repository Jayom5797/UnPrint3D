import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
  color: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, color: string) => void;
  removeFromCart: (productId: number, color: string) => void;
  emptyCart: () => void;
  updateQuantity: (productId: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number, color: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id && item.color === color);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity, color }];
      }
    });
  };

  const removeFromCart = (productId: number, color: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId || item.color !== color));
  };

  const emptyCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, emptyCart }}>
      {children}
    </CartContext.Provider>
  );
};
