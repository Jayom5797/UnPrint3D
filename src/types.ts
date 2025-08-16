// Represents a single color option for a product
export interface ProductColor {
  id: number;
  product_id: number;
  name: string;
  hex_code: string;
}

// Represents a single image for a product
export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
}

// Represents the core product details, with related images and colors
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  created_at: string;
  product_images: ProductImage[]; // Array of images
  product_colors: ProductColor[]; // Array of colors
}

// Represents a single item within an order
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  color: string;
  // Optional: Include product details if joined in a query
  products?: { title: string };
}

// Represents a customer's order
export interface Order {
  id: number;
  customer_id: string;
  total_price: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

// Represents the structure of the orders_with_details view for the admin dashboard
export interface OrderWithDetails extends Omit<Order, 'order_items'> {
  customer_email: string;
  order_items: {
    product_title: string;
    quantity: number;
    color: string;
    price: number;
  }[];
}
