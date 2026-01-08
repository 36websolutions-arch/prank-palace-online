-- Add detailed recipient address fields to subscription_orders
ALTER TABLE public.subscription_orders 
ADD COLUMN IF NOT EXISTS recipient_title text,
ADD COLUMN IF NOT EXISTS recipient_company text,
ADD COLUMN IF NOT EXISTS recipient_address_line1 text,
ADD COLUMN IF NOT EXISTS recipient_address_line2 text,
ADD COLUMN IF NOT EXISTS recipient_city text,
ADD COLUMN IF NOT EXISTS recipient_state text,
ADD COLUMN IF NOT EXISTS recipient_zipcode text,
ADD COLUMN IF NOT EXISTS recipient_country text DEFAULT 'United States',
ADD COLUMN IF NOT EXISTS recipient_email text;