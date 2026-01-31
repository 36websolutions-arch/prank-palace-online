-- Add citizen tier tracking to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS citizen_tier TEXT DEFAULT 'citizen' CHECK (citizen_tier IN ('plebeian', 'citizen', 'senator', 'consul', 'emperor')),
ADD COLUMN IF NOT EXISTS total_donated DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS chronicles_read INTEGER DEFAULT 0;

-- Create table for logging Ko-fi donations
CREATE TABLE IF NOT EXISTS public.kofi_donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kofi_transaction_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    from_name TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    type TEXT NOT NULL, -- 'Donation', 'Subscription', 'Commission', 'Shop Order'
    tier_name TEXT, -- For subscription tiers
    is_subscription_payment BOOLEAN DEFAULT FALSE,
    is_first_subscription_payment BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    message TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_kofi_donations_email ON public.kofi_donations(email);
CREATE INDEX IF NOT EXISTS idx_kofi_donations_user_id ON public.kofi_donations(user_id);

-- Function to update citizen tier based on total donations
CREATE OR REPLACE FUNCTION update_citizen_tier()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET
        total_donated = (
            SELECT COALESCE(SUM(amount), 0)
            FROM public.kofi_donations
            WHERE user_id = NEW.user_id OR email = (SELECT email FROM public.profiles WHERE id = NEW.user_id)
        ),
        citizen_tier = CASE
            WHEN (SELECT COALESCE(SUM(amount), 0) FROM public.kofi_donations WHERE user_id = NEW.user_id OR email = (SELECT email FROM public.profiles WHERE id = NEW.user_id)) >= 100 THEN 'emperor'
            WHEN (SELECT COALESCE(SUM(amount), 0) FROM public.kofi_donations WHERE user_id = NEW.user_id OR email = (SELECT email FROM public.profiles WHERE id = NEW.user_id)) >= 25 THEN 'consul'
            WHEN (SELECT COALESCE(SUM(amount), 0) FROM public.kofi_donations WHERE user_id = NEW.user_id OR email = (SELECT email FROM public.profiles WHERE id = NEW.user_id)) >= 5 THEN 'senator'
            ELSE 'citizen'
        END
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update tier after donation
DROP TRIGGER IF EXISTS on_kofi_donation ON public.kofi_donations;
CREATE TRIGGER on_kofi_donation
    AFTER INSERT ON public.kofi_donations
    FOR EACH ROW
    WHEN (NEW.user_id IS NOT NULL)
    EXECUTE FUNCTION update_citizen_tier();

-- RLS policies for kofi_donations
ALTER TABLE public.kofi_donations ENABLE ROW LEVEL SECURITY;

-- Allow the service role to insert donations (for webhook)
CREATE POLICY "Service role can insert donations" ON public.kofi_donations
    FOR INSERT
    WITH CHECK (true);

-- Allow users to read their own donations
CREATE POLICY "Users can read own donations" ON public.kofi_donations
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow admins to read all donations
CREATE POLICY "Admins can read all donations" ON public.kofi_donations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
