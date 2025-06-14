
-- إنشاء جدول طلبات الموافقة على المنتجات
CREATE TABLE public.product_approval_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC NOT NULL,
  product_category_id UUID REFERENCES public.categories(id),
  product_description TEXT,
  product_image TEXT DEFAULT '/placeholder.svg',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول طلبات العروض
CREATE TABLE public.offer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id),
  discount_percentage INTEGER NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة عمود merchant_id إلى جدول المنتجات
ALTER TABLE public.products ADD COLUMN merchant_id UUID;

-- إضافة عمود merchant_password إلى جدول الإعدادات
ALTER TABLE public.store_settings ADD COLUMN merchant_password TEXT;

-- إنشاء فهارس للأداء
CREATE INDEX idx_product_approval_requests_merchant_id ON public.product_approval_requests(merchant_id);
CREATE INDEX idx_product_approval_requests_status ON public.product_approval_requests(status);
CREATE INDEX idx_offer_requests_merchant_id ON public.offer_requests(merchant_id);
CREATE INDEX idx_offer_requests_status ON public.offer_requests(status);
CREATE INDEX idx_products_merchant_id ON public.products(merchant_id);
