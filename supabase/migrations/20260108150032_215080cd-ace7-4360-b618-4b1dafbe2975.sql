-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;

CREATE POLICY "Anyone can view products"
ON public.products
FOR SELECT
TO public
USING (true);