import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  product_colors: { name: string; hex_code: string }[];
}

interface EditProductFormProps {
  product: Product | null;
  onClose: () => void;
  onProductUpdate: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onClose, onProductUpdate }) => {
  const [formData, setFormData] = useState({ title: '', description: '', price: '', colors: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description || '',
        price: product.price.toString(),
        colors: product.product_colors.map(c => `${c.name} ${c.hex_code}`).join(', '),
      });
    }
  }, [product]);

  if (!product) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Update basic product info
      const { error: productUpdateError } = await supabase
        .from('products')
        .update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
        })
        .eq('id', product.id);

      if (productUpdateError) throw productUpdateError;

      // 2. Delete old colors for the product
      const { error: deleteColorsError } = await supabase
        .from('product_colors')
        .delete()
        .eq('product_id', product.id);

      if (deleteColorsError) throw deleteColorsError;

      // 3. Insert new colors
      const newColors = formData.colors.split(',').map(color => {
        const [name, hex] = color.trim().split(' ');
        return { 
          product_id: product.id,
          name: name || 'Color',
          hex_code: hex || '#000000'
        };
      });

      if (newColors.length > 0) {
        const { error: insertColorsError } = await supabase
          .from('product_colors')
          .insert(newColors);
        
        if (insertColorsError) throw insertColorsError;
      }

      alert('Product updated successfully!');
      onProductUpdate();
      onClose();
    } catch (err: any) {
      setError(`Error updating product: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
          </div>
          <div>
            <label htmlFor="colors" className="block text-sm font-medium text-gray-700">Colors</label>
            <input type="text" name="colors" value={formData.colors} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;