-- Create cart items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  variant_name TEXT,
  variant_price DECIMAL(10,2),
  add_ons JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id, variant_name)
);

-- Create product add-ons table
CREATE TABLE public.product_add_ons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loyalty points config table
CREATE TABLE public.loyalty_points_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL UNIQUE,
  points_per_item INTEGER DEFAULT 0,
  bonus_threshold INTEGER,
  bonus_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user loyalty points table
CREATE TABLE public.user_loyalty_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  points_redeemed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_loyalty_points ENABLE ROW LEVEL SECURITY;

-- Cart items policies
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cart items" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
ON public.cart_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
ON public.cart_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Product add-ons policies (public read)
CREATE POLICY "Product add-ons are viewable by everyone" 
ON public.product_add_ons 
FOR SELECT 
USING (true);

-- Loyalty points config policies (public read)
CREATE POLICY "Loyalty points config is viewable by everyone" 
ON public.loyalty_points_config 
FOR SELECT 
USING (true);

-- User loyalty points policies
CREATE POLICY "Users can view their own loyalty points" 
ON public.user_loyalty_points 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loyalty points record" 
ON public.user_loyalty_points 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loyalty points" 
ON public.user_loyalty_points 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_loyalty_points_updated_at
  BEFORE UPDATE ON public.user_loyalty_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample add-ons data
INSERT INTO public.product_add_ons (product_id, name, price, description) VALUES
('1', 'Extra Butter', 0.50, 'Additional French butter'),
('1', 'Jam Selection', 1.25, 'Choice of strawberry, raspberry, or apricot jam'),
('2', 'Artisan Butter', 1.00, 'Premium cultured butter'),
('3', 'Extra Filling', 0.75, 'Double the filling portion'),
('4', 'Herb Seasoning', 0.25, 'Rosemary and thyme seasoning');

-- Insert sample loyalty points config
INSERT INTO public.loyalty_points_config (product_id, points_per_item, bonus_threshold, bonus_points) VALUES
('1', 5, 10, 20),
('2', 8, 5, 15),
('3', 6, 8, 18),
('4', 4, 12, 25);