
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Product } from '../types';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            title,
            description,
            price,
            product_images ( image_url )
          `)
          .limit(3);

        if (error) throw error;

        if (data) {
          const formattedProducts = data.map(product => ({
            id: product.id,
            title: product.title,
            description: product.description,
            price: `₹${product.price}`,
            image: product.product_images[0]?.image_url ? supabase.storage.from('product-images').getPublicUrl(product.product_images[0].image_url).data.publicUrl : '',
            images: [], // Not needed for featured view
            colors: [], // Not needed for featured view
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Premium Filaments
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            High-quality 3D printing filaments for all your creative projects
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Product Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    {product.price}
                  </span>
                  <Link to={`/product/${product.id}`} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )))
          }
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/shop" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200">
            View All Filaments
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
