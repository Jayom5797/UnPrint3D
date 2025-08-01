import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import plaImage from '../assets/pla.png';
import absImage from '../assets/abs.png';

import gidImage from '../assets/gid.png';
import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    title: 'PLA+ Filament (1kg)',
    description: 'High-quality PLA+ filament for 3D printing.',
    price: '₹699',
    image: plaImage,
    images: [plaImage, absImage, plaImage],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Red', hex: '#D12A1F' },
      { name: 'Blue', hex: '#1E4EDD' },
      { name: 'Green', hex: '#22C122' },
      { name: 'Yellow', hex: '#F0B923' },
      { name: 'Orange', hex: '#FF5E00' },
      { name: 'Metalic Blue', hex: '#32527B' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Grey', hex: '#5A5F56' },
      { name: 'Brown', hex: '#8B5A2B' },
      { name: 'Sky Blue', hex: '#88D1F2' },
      { name: 'Copper', hex: '#B85433' },
      { name: 'Skin', hex: '#F4C49B' },
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Ivory', hex: '#F6E8B1' },
      { name: 'Purple', hex: '#8A68C6' },
    ]
  },
  {
    id: 2,
    title: 'ABS Filament (1kg)',
    description: 'A different brand of filament.',
    price: '₹749',
    image: absImage,
    images: [absImage, plaImage, plaImage],
    colors: [
      { name: 'Black', hex: '#111111' },
      { name: 'Red', hex: '#DA2423' },
      { name: 'Yellow', hex: '#FAC500' },
      { name: 'Green', hex: '#23BA2A' },
      { name: 'White', hex: '#F2F2F2' },
      { name: 'Gray', hex: '#AABC82' },
      { name: 'Natural', hex: '#F2E1B8' },
      { name: 'Blue', hex: '#0096DD' },
      { name: 'Orange', hex: '#F58400' },
    ]
  },
  {
    id: 3,
    title: 'PETG Filament (1kg)',
    description: 'Durable and easy to print.',
    price: '₹899',
    image: plaImage, // Using plaImage as a placeholder for PETG
    images: [plaImage, plaImage, absImage],
    colors: [
      { name: 'Translucent Red', hex: '#D93B1E' },
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Green', hex: '#1FA53B' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Natural', hex: '#D9D9D9' },
      { name: 'Blue', hex: '#0F539E' },
      { name: 'Yellow', hex: '#F4D100' },
    ]
  },
  {
    id: 4,
    title: 'Glow in the Dark Filament',
    description: 'Fun filament that glows.',
    price: '₹1499',
    image: gidImage,
    images: [gidImage, plaImage, plaImage],
    colors: [
      { name: 'Yellow', hex: '#facc15' },
      { name: 'Green', hex: '#84cc16' },
      { name: 'Teal', hex: '#10b981' },
      { name: 'Sky Blue', hex: '#0ea5e9' },
    ]
  },
  {
    id: 5,
    title: 'Flexible TPU Filament',
    description: 'For printing flexible objects.',
    price: '₹1299',
    image: plaImage, // Using plaImage as a placeholder for TPU
    images: [plaImage, absImage, gidImage],
    colors: [
      { name: 'Blue', hex: '#3b82f6' },
      { name: 'Purple', hex: '#8b5cf6' },
      { name: 'Light Purple', hex: '#a78bfa' },
      { name: 'Rose', hex: '#e11d48' },
    ]  }
];

const ShoppingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center my-8">All Products</h1>
        <div className="flex">
          {/* Filter Sidebar */}
          <div className="w-1/6 p-4 border-r">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            {/* Filter options will go here */}
            <p>Filter placeholder</p>
          </div>

          {/* Product List */}
          <div className="w-5/6 p-4">
            <div className="grid grid-cols-2 gap-4">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  id={product.id} 
                  title={product.title} 
                  description={product.description} 
                  price={product.price} 
                  image={product.image} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShoppingPage;
