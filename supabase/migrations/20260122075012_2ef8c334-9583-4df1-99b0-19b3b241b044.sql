-- Create blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  published_at DATE,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  author_id UUID NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view published blogs
CREATE POLICY "Anyone can view published blogs"
ON public.blogs
FOR SELECT
USING (is_published = true);

-- Admins can view all blogs (including unpublished)
CREATE POLICY "Admins can view all blogs"
ON public.blogs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert blogs
CREATE POLICY "Admins can insert blogs"
ON public.blogs
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update blogs
CREATE POLICY "Admins can update blogs"
ON public.blogs
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete blogs
CREATE POLICY "Admins can delete blogs"
ON public.blogs
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();