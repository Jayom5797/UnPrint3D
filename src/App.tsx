import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShoppingPage from "./pages/ShoppingPage";
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';
import SocialLinks from './components/SocialLinks';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';


function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar session={session} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShoppingPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
          <SocialLinks />
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
