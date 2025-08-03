import React from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import HowItWorks from '../components/HowItWorks';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div>
        <Hero />
        <FeaturedProducts />
        <HowItWorks />
      </div>
    </div>
  );
};

export default HomePage;
