
-- 1. إنشاء جدول الكوبونات الجديد
CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_percent integer NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  start_date date NOT NULL DEFAULT current_date,
  end_date date NOT NULL,
  max_usage integer NOT NULL DEFAULT 1,
  usage_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. السماح للمستخدمين المسجّلين برؤية الكوبونات وتطبيقها
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can select active coupons"
  ON public.coupons FOR SELECT
  USING (is_active AND start_date <= current_date AND end_date >= current_date);

-- 3. إضافة عمود رقم الواتساب وعمود حالة التاجر إلى جدول profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS whatsapp_number text,
  ADD COLUMN IF NOT EXISTS merchant_status text DEFAULT 'pending';

-- 4. تحديث أو إضافة القيود بحيث يكون merchant_status أحد القيم ('pending','approved','rejected',null)
  -- (Postgres لايدعم Enum ديناميكي، لذلك أفضل حمايتها بالكود لاحقًا في التطبيق)

