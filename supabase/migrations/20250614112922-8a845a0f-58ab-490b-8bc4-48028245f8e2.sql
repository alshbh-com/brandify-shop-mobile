
-- ١- إنشاء جدول تسجيل استخدام الكوبونات من قبل المستخدمين
CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coupon_id text NOT NULL,
  used_at timestamp with time zone DEFAULT now()
);

-- ٢- سياسة تتيح للمستخدمين رؤية استهلاكهم فقط
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "can view own coupon usages" ON public.coupon_usages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "can insert own coupon usage" ON public.coupon_usages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- (لا حاجة لتعديلات إضافية على user_roles لأن برمجياً سنقوم بإسناد دور التاجر)

