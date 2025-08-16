-- Proposed Database Schema for UnPrint3D

-- Users table is managed by Supabase Auth.

-- 1. Products Table
-- Stores the core product information.
CREATE TABLE products (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Product Images Table
-- Stores multiple images for each product.
CREATE TABLE product_images (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Product Colors Table
-- Stores available colors for each product.
CREATE TABLE product_colors (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    hex_code VARCHAR(7) NOT NULL,
    UNIQUE(product_id, name)
);

-- 4. Orders Table
-- Stores order information, linked to a customer.
CREATE TABLE orders (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    customer_id UUID NOT NULL REFERENCES auth.users(id),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    status TEXT NOT NULL DEFAULT 'Pending', -- e.g., 'Pending', 'Shipped', 'Delivered'
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Order Items Table
-- A junction table linking orders and products.
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_at_purchase NUMERIC(10, 2) NOT NULL CHECK (price_at_purchase >= 0),
    color TEXT -- Storing color as text as per current implementation.
);

-- 6. View for Admin Dashboard
-- A view to simplify fetching detailed order information for the admin panel.
CREATE OR REPLACE VIEW public.orders_with_details AS
SELECT
    o.id,
    o.created_at,
    o.total_price,
    o.customer_id,
    o.status,
    u.email AS customer_email,
    json_agg(json_build_object(
        'product_title', p.title,
        'quantity', oi.quantity,
        'color', oi.color,
        'price', oi.price_at_purchase
    )) AS order_items
FROM
    orders o
JOIN
    auth.users u ON o.customer_id = u.id
JOIN
    order_items oi ON o.id = oi.order_id
JOIN
    products p ON oi.product_id = p.id
GROUP BY
    o.id, u.email;

-- 7. Function to Send Email via Resend API
-- This function makes an HTTP POST request to the Resend API.
-- It requires the 'http' extension to be enabled in Supabase.
CREATE OR REPLACE FUNCTION public.send_email(
  to_email TEXT,
  subject TEXT,
  html_content TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Must be run with security definer to access secrets.
AS $$
DECLARE
  res HTTP_RESPONSE;
  -- IMPORTANT: Replace with your actual Resend API key.
  api_key TEXT := 'YOUR_RESEND_API_KEY'; 
  -- IMPORTANT: Replace with a verified sender email from your Resend account.
  from_email TEXT := 'UnPrint3D <noreply@yourdomain.com>'; 
BEGIN
  SELECT * INTO res
  FROM http((
    'POST',
    'https://api.resend.com/emails',
    ARRAY[
      ('Content-Type', 'application/json')::http_header,
      ('Authorization', 'Bearer ' || api_key)::http_header
    ],
    json_build_object(
      'from', from_email,
      'to', to_email,
      'subject', subject,
      'html', html_content
    )::text,
    NULL
  )::http_request);

  RETURN res.content::jsonb;
END;
$$;

-- 8. Trigger Function to Prepare and Send Order Confirmation
-- This function gathers order details, constructs the email, and calls send_email().
CREATE OR REPLACE FUNCTION public.handle_new_order_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  customer_email TEXT;
  customer_name TEXT;
  order_items_html TEXT := '';
  email_html TEXT;
  admin_notification_html TEXT;
  -- IMPORTANT: Replace with your admin email address.
  admin_email_address TEXT := 'YOUR_ADMIN_EMAIL@example.com';
BEGIN
  -- Get customer details from the auth schema.
  SELECT u.email, u.raw_user_meta_data->>'full_name' INTO customer_email, customer_name
  FROM auth.users u
  WHERE u.id = NEW.customer_id;

  IF NOT FOUND THEN
    RAISE NOTICE 'Customer not found for order ID %', NEW.id;
    RETURN NEW;
  END IF;

  -- Aggregate order items into an HTML string.
  SELECT 
    string_agg(
      format(
        '<tr><td>%s (%s)</td><td>%s</td><td style="text-align: right;">₹%s</td></tr>',
        p.title, 
        oi.color, 
        oi.quantity, 
        oi.price_at_purchase::numeric(10,2)
      ),
      ''
    ) INTO order_items_html
  FROM order_items oi
  JOIN products p ON oi.product_id = p.id
  WHERE oi.order_id = NEW.id;

  -- Construct the customer email body.
  -- NOTE: This is a simplified HTML structure. You should replace this with the full HTML from your template file.
  email_html := format(
    '<h2>Thank you for your order, %s!</h2><p>Your Order ID is #%s.</p><table><thead><tr><th>Product</th><th>Quantity</th><th>Price</th></tr></thead><tbody>%s</tbody><tfoot><tr><td colspan="2">Total:</td><td>₹%s</td></tr></tfoot></table>',
    COALESCE(customer_name, 'Valued Customer'),
    NEW.id,
    order_items_html,
    NEW.total_price::numeric(10,2)
  );

  -- Send the confirmation email to the customer.
  PERFORM public.send_email(
    customer_email,
    format('Your UnPrint3D Order Confirmation #%s', NEW.id),
    email_html
  );

  -- Construct and send the notification email to the admin.
  admin_notification_html := format('A new order (#%s) was placed by %s (%s) for a total of ₹%s.', 
    NEW.id, 
    COALESCE(customer_name, 'Customer'), 
    customer_email, 
    NEW.total_price::numeric(10,2)
  );
  
  PERFORM public.send_email(
    admin_email_address,
    format('New Order Received: #%s', NEW.id),
    admin_notification_html
  );

  RETURN NEW;
END;
$$;

-- 9. Trigger on Orders Table
-- This trigger fires after a new order is inserted.
CREATE OR REPLACE TRIGGER on_order_created_send_email
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_order_email();



