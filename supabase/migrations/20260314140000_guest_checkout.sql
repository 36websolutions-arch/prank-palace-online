-- Allow guest checkout by removing UUID FK constraint on physical_orders.user_id
-- This lets guests check out with email as their identifier

-- Step 1: Drop the FK constraint on user_id
ALTER TABLE public.physical_orders DROP CONSTRAINT IF EXISTS physical_orders_user_id_fkey;

-- Step 2: Drop ALL policies that reference user_id BEFORE altering its type
DROP POLICY IF EXISTS "Users can insert own physical orders" ON public.physical_orders;
DROP POLICY IF EXISTS "Users can view own physical orders" ON public.physical_orders;

-- Step 3: Now safe to change user_id from UUID to TEXT
ALTER TABLE public.physical_orders ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Step 4: Allow anyone to insert orders (payment is verified by Stripe/PayPal)
CREATE POLICY "Anyone can insert physical orders"
  ON public.physical_orders FOR INSERT
  WITH CHECK (true);

-- Step 5: Logged-in users see own orders (TEXT comparison)
CREATE POLICY "Users can view own physical orders"
  ON public.physical_orders FOR SELECT
  USING (auth.uid()::TEXT = user_id);

-- Admin policies remain unchanged (they use has_role which doesn't touch user_id)
