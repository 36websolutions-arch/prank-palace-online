-- Drop the existing check constraint and add a new one that includes 'subscription'
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_type_check;

ALTER TABLE public.products ADD CONSTRAINT products_type_check 
CHECK (type IN ('digital', 'physical', 'subscription'));