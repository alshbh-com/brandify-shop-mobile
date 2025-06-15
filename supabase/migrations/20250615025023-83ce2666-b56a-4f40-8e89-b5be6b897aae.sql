
-- التحقق من وجود الأقسام وإعادة إنشائها إذا لزم الأمر
-- أولاً: حذف البيانات الموجودة والبدء من جديد
TRUNCATE TABLE public.categories RESTART IDENTITY CASCADE;

-- إضافة الأقسام الرئيسية مرة أخرى مع معرفات ثابتة
INSERT INTO public.categories (id, name, image, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'الملابس والأزياء', '/placeholder.svg', now(), now()),
('550e8400-e29b-41d4-a716-446655440002', 'الإلكترونيات', '/placeholder.svg', now(), now()),
('550e8400-e29b-41d4-a716-446655440003', 'المنزل والمطبخ', '/placeholder.svg', now(), now()),
('550e8400-e29b-41d4-a716-446655440004', 'الرياضة واللياقة', '/placeholder.svg', now(), now()),
('550e8400-e29b-41d4-a716-446655440005', 'الجمال والعناية', '/placeholder.svg', now(), now()),
('550e8400-e29b-41d4-a716-446655440006', 'الكتب والقرطاسية', '/placeholder.svg', now(), now()),
('550e8400-e29b-41d4-a716-446655440007', 'الألعاب والترفيه', '/placeholder.svg', now(), now()),
('550e8400-e29b-41d4-a716-446655440008', 'السيارات وقطع الغيار', '/placeholder.svg', now(), now()),
('550e8400-e29b-41d4-a716-446655440009', 'الطعام والمشروبات', '/placeholder.svg', now(), now()),
('550e8400-e29b-41d4-a716-446655440010', 'الصحة والدواء', '/placeholder.svg', now(), now());

-- التأكد من إعداد Row Level Security بشكل صحيح
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسة للسماح بالقراءة للجميع
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
CREATE POLICY "Enable read access for all users" ON public.categories
    FOR SELECT USING (true);

-- إنشاء سياسة للسماح بالكتابة للمستخدمين المصادق عليهم
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.categories;
CREATE POLICY "Enable insert for authenticated users only" ON public.categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- إنشاء سياسة للسماح بالتحديث للمستخدمين المصادق عليهم
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.categories;
CREATE POLICY "Enable update for authenticated users only" ON public.categories
    FOR UPDATE USING (auth.role() = 'authenticated');

-- إنشاء سياسة للسماح بالحذف للمستخدمين المصادق عليهم
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.categories;
CREATE POLICY "Enable delete for authenticated users only" ON public.categories
    FOR DELETE USING (auth.role() = 'authenticated');
