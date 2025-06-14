
-- ١- إنشاء نوع الأدوار
CREATE TYPE public.app_role AS ENUM ('admin', 'merchant', 'user');

-- ٢- جدول ربط المستخدم بالأدوار
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- ٣- تفعيل RLS على جدول user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ٤- دالة التأكد من الدور
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- ٥- سياسة تسمح للمستخدم بقراءة دوره فقط (يمكنك تخصيصها لاحقًا)
CREATE POLICY "يمكن للمستخدم رؤية دوره" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "يمكن للمستخدم إضافة دوره الأول مرة" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

