
-- Add subcategories table for nested categories (like restaurants, clothing stores)
CREATE TABLE public.subcategories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT DEFAULT '/placeholder.svg',
  banner_image TEXT DEFAULT '/placeholder.svg',
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update products table to include subcategory reference
ALTER TABLE products ADD COLUMN subcategory_id UUID REFERENCES subcategories(id);

-- Add RLS policies for subcategories
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active subcategories" ON public.subcategories FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage all subcategories" ON public.subcategories FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Merchants can manage their subcategories" ON public.subcategories FOR ALL USING (auth.uid() = merchant_id);
