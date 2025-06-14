
-- Add size options and pricing columns to products table
ALTER TABLE public.products 
ADD COLUMN size_s_price numeric DEFAULT NULL,
ADD COLUMN size_m_price numeric DEFAULT NULL,
ADD COLUMN size_l_price numeric DEFAULT NULL,
ADD COLUMN has_sizes boolean DEFAULT false;

-- Update product_approval_requests table to include size options
ALTER TABLE public.product_approval_requests
ADD COLUMN size_s_price numeric DEFAULT NULL,
ADD COLUMN size_m_price numeric DEFAULT NULL,
ADD COLUMN size_l_price numeric DEFAULT NULL,
ADD COLUMN has_sizes boolean DEFAULT false;
