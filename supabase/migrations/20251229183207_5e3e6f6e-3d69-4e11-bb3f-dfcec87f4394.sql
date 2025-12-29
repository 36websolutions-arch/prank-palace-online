-- Add subscription_options column to products table for subscription products
ALTER TABLE public.products 
ADD COLUMN subscription_options jsonb DEFAULT NULL;

-- Create subscription_orders table
CREATE TABLE public.subscription_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  subscription_name TEXT NOT NULL,
  subscription_price NUMERIC NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_address TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  payment_method TEXT NOT NULL,
  payment_provider TEXT NOT NULL DEFAULT 'PayPal',
  paypal_order_id TEXT,
  amount_paid NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_orders ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscription_orders
CREATE POLICY "Users can insert own subscription orders"
ON public.subscription_orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own subscription orders"
ON public.subscription_orders
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscription orders"
ON public.subscription_orders
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update subscription orders"
ON public.subscription_orders
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));