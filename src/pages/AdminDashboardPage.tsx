

import OrderList from '../components/admin/OrderList';
import AddProductForm from '../components/admin/AddProductForm';
import ProductList from '../components/admin/ProductList';

const AdminDashboardPage = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to the admin area. Here you can manage products and orders.</p>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add a New Product</h2>
          <AddProductForm />
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Manage Existing Products</h2>
          <ProductList />
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Orders</h2>
          <OrderList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
