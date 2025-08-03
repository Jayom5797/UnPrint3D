import { useState, useEffect } from 'react';
import EditProductForm from './EditProductForm';
import { supabase } from '../../supabaseClient';


interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  product_images: { image_url: string }[];
  product_colors: { name: string; hex_code: string }[];
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
        id, title, description, price,
        product_images ( image_url ),
        product_colors ( name, hex_code )
      `)
        .order('created_at', { ascending: false });

            if (error) throw error;

      const productsWithPublicUrls = (data || []).map(product => {
        const imageUrl = product.product_images[0]?.image_url;
        if (imageUrl) {
          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(imageUrl);
          
          return {
            ...product,
            // Overwrite the potentially incorrect URL from the DB with the correct public one
            product_images: [{ image_url: publicUrlData.publicUrl }],
          };
        }
        return product;
      });

      setProducts(productsWithPublicUrls);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

    const handleRemove = async (product: Product) => {
    if (!window.confirm('Are you sure you want to remove this product?')) {
      return;
    }

    const { id: productId, product_images } = product;
    const imageUrl = product_images[0]?.image_url;

    try {
      // If there's an image, delete it from storage first
      if (imageUrl) {
        const imagePath = new URL(imageUrl).pathname.split('/product-images/')[1];
        if (imagePath) {
          const { error: storageError } = await supabase.storage
            .from('product-images')
            .remove([imagePath]);

          if (storageError) {
            // Don't block product deletion if image deletion fails, just log it
            console.error('Error deleting image from storage:', storageError.message);
          }
        }
      }

      // Delete product from the database
      // RLS policies with 'on delete cascade' will handle related images and colors
      const { error: dbError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (dbError) throw dbError;

      // Update state to remove the product from the UI
      setProducts(products.filter(p => p.id !== productId));
      alert('Product removed successfully!');

    } catch (err: any) {
      const errorMessage = `Error removing product: ${err.message}`;
      setError(errorMessage);
      alert(errorMessage);
    }
  };

    const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
  };

  const handleProductUpdate = () => {
    handleCloseModal();
    fetchProducts(); // Re-fetch products to show updated data
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Products</h2>
            <div className="space-y-4">
        {editingProduct && (
          <EditProductForm 
            product={editingProduct}  
            onClose={handleCloseModal} 
            onProductUpdate={handleProductUpdate} 
          />
        )}
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map(product => (
            <div key={product.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <img src={product.product_images[0]?.image_url} alt={product.title} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-semibold">{product.title}</p>
                  <p className="text-sm text-gray-600">₹{product.price.toFixed(2)}</p>
                </div>
              </div>
                            <div className="flex space-x-2 mt-4 sm:mt-0 self-end sm:self-auto">
                <button
                  onClick={() => handleEdit(product)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemove(product)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;