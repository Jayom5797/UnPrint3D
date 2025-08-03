

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

const Navbar: React.FC<{ session: Session | null }> = ({ session }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              UnPrint
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Shop
              </Link>
              <a
                href="/#how-it-works"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                How It Works
              </a>
              <a
                href="/#featured-products"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Featured Products
              </a>
              <Link to="/cart" className="text-gray-900 hover:text-blue-600 p-2 rounded-full">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-900 text-sm font-medium">{session.user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={handleMenuToggle} className="text-gray-900 hover:text-gray-600 focus:outline-none focus:text-gray-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={handleLinkClick}
              className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Shop
            </Link>
            <a
              href="/#how-it-works"
              onClick={handleLinkClick}
              className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              How It Works
            </a>
            <a
              href="/#featured-products"
              onClick={handleLinkClick}
              className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Featured Products
            </a>
            <Link
              to="/cart"
              onClick={handleLinkClick}
              className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Cart
            </Link>
            {session ? (
              <button
                onClick={() => { handleLogout(); handleLinkClick(); }}
                className="w-full text-left bg-red-600 text-white hover:bg-red-700 block px-4 py-2 rounded-lg text-base font-medium text-center"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="bg-blue-600 text-white hover:bg-blue-700 block px-4 py-2 rounded-lg text-base font-medium text-center"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar;
