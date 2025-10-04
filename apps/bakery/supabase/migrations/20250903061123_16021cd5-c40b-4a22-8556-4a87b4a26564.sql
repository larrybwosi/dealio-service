-- Create orders table for purchase history
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  order_number text NOT NULL UNIQUE,
  total_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  delivery_address jsonb,
  delivery_notes text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  loyalty_points_earned integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create user referrals table
CREATE TABLE public.user_referrals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  referral_code text NOT NULL UNIQUE,
  referred_users integer DEFAULT 0,
  total_rewards numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own referrals" 
ON public.user_referrals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own referrals" 
ON public.user_referrals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own referrals" 
ON public.user_referrals 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for order timestamps
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample orders for demo
INSERT INTO public.orders (user_id, order_number, total_amount, status, delivery_address, delivery_notes, items, loyalty_points_earned, created_at) 
SELECT 
  auth.uid(),
  'ORD-' || LPAD((ROW_NUMBER() OVER())::text, 6, '0'),
  (array[15.50, 23.75, 31.25, 18.90, 42.15])[ROW_NUMBER() OVER()],
  (array['delivered', 'delivered', 'in-transit', 'delivered', 'pending'])[ROW_NUMBER() OVER()],
  jsonb_build_object(
    'street', '123 Bakery St',
    'city', 'Sweet City',
    'state', 'CA',
    'postal_code', '90210'
  ),
  (array['Leave at door', 'Ring doorbell', null, 'Call when arrived', 'Contact concierge'])[ROW_NUMBER() OVER()],
  jsonb_build_array(
    jsonb_build_object('name', 'Artisan Croissants', 'quantity', 4, 'price', 3.50),
    jsonb_build_object('name', 'Sourdough Bread', 'quantity', 1, 'price', 8.00)
  ),
  (array[15, 24, 31, 19, 42])[ROW_NUMBER() OVER()],
  now() - interval '1 day' * (ROW_NUMBER() OVER())
FROM generate_series(1, 5)
WHERE auth.uid() IS NOT NULL;