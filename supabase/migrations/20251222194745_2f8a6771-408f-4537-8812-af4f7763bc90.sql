-- Add optional phone column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone text DEFAULT NULL;

-- Update the handle_new_user function to include phone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname, phone)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'nickname', 'Prankster'),
    new.raw_user_meta_data ->> 'phone'
  );
  RETURN new;
END;
$$;