-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('digital', 'physical')),
  image TEXT,
  description TEXT,
  digital_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create digital_orders table
CREATE TABLE public.digital_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  email TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_provider TEXT NOT NULL DEFAULT 'PayPal',
  paypal_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Delivered')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Create physical_orders table
CREATE TABLE public.physical_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  items JSONB NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_provider TEXT NOT NULL DEFAULT 'PayPal',
  paypal_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Delivered')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physical_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nickname', 'Prankster'),
    NEW.email,
    'user'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for digital_orders
CREATE POLICY "Users can view own digital orders"
  ON public.digital_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own digital orders"
  ON public.digital_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all digital orders"
  ON public.digital_orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update digital orders"
  ON public.digital_orders FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for physical_orders
CREATE POLICY "Users can view own physical orders"
  ON public.physical_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own physical orders"
  ON public.physical_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all physical orders"
  ON public.physical_orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update physical orders"
  ON public.physical_orders FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for cart_items
CREATE POLICY "Users can view own cart"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own cart"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));