import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { supabase } from '../supabaseClient';

// Define a new type for the product data used in this component
interface ProductForCard extends Product {
  primary_image_url: string;
}

const ShoppingPage: React.FC = () => {
  const [products, setProducts] = useState<ProductForCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images ( image_url )
          `);

        if (error) throw error;

        if (data) {
          const processedData = data.map(product => ({
            ...product,
            product_images: product.product_images || [],
            product_colors: product.product_colors || [],
            // Get the public URL for the primary image
            primary_image_url: product.product_images?.[0]?.image_url 
              ? supabase.storage.from('product-images').getPublicUrl(product.product_images[0].image_url).data.publicUrl 
              : '/placeholder.png', // Fallback image
          }));
          setProducts(processedData as ProductForCard[]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center my-8">All Products</h1>

        {/* Filter button for mobile */}
        <div className="md:hidden mb-4">
          <button onClick={toggleFilter} className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded">
            {isFilterOpen ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Filter Sidebar */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-1/5 p-4 border-b md:border-b-0 md:border-r`}>
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <div className="mb-4">
              <Link to="/shop" className="block w-full text-center bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700">
                View All Filaments
              </Link>
            </div>
            {/* Filter options will go here */}
            <p>Filter placeholder</p>
          </div>

          {/* Product List */}
          <div className="w-full md:w-4/5 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loading ? (
                <p>Loading products...</p>
              ) : (
                products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id} 
                    title={product.title} 
                    description={product.description || ''} 
                    price={product.price} 
                    image={product.primary_image_url} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ShoppingPage;
