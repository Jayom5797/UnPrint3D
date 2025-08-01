import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import plaImage from '../assets/pla.png';
import gidImage from '../assets/gid.png';
import absImage from '../assets/abs.png';

const products = [
  {
    id: 1,
    title: "PLA+ Filament (1kg)",
    price: "₹699",
    description: "High-quality PLA+ for smooth, reliable printing.",
    image: plaImage
  },
  {
    id: 2,
    title: "ABS Filament (1kg)",
    price: "₹749",
    description: "Strong and sturdy ABS for functional parts.",
    image: absImage
  },
  {
    id: 3,
    title: "Glow In Dark Filament (1kg)",
    price: "₹1,499",
    description: "Create stunning prints that glow in the dark.",
    image: gidImage
  },
  {
    id: 4,
    title: "PETG Filament (1kg)",
    price: "₹899",
    description: "Durable and temperature-resistant PETG.",
    image: plaImage // Placeholder image
  },
  {
    id: 5,
    title: "TPU Filament (1kg)",
    price: "₹1,299",
    description: "Flexible and durable TPU for elastic parts.",
    image: absImage // Placeholder image
  }
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
