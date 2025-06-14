
-- حذف جميع السياسات الموجودة من جدول profiles وإعادة إنشاؤها
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "يمكن للمستخدم رؤية دوره" ON public.user_roles;
DROP POLICY IF EXISTS "يمكن للمستخدم إضافة دوره الأول مرة" ON public.user_roles;
DROP POLICY IF EXISTS "can view own coupon usages" ON public.coupon_usages;
DROP POLICY IF EXISTS "can insert own coupon usage" ON public.coupon_usages;
DROP POLICY IF EXISTS "Anyone can select active coupons" ON public.coupons;

-- إنشاء السياسات الجديدة لجدول profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- سياسات جدول user_roles للمسؤول
CREATE POLICY "Admin can view all user roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can insert user roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete user roles"
  ON public.user_roles
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- سياسات جدول الكوبونات للمسؤول
CREATE POLICY "Admins can view all coupons"
  ON public.coupons
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert coupons"
  ON public.coupons
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update coupons"
  ON public.coupons
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete coupons"
  ON public.coupons
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- السماح للمستخدمين العامة برؤية الكوبونات النشطة
CREATE POLICY "Users can view active coupons"
  ON public.coupons
  FOR SELECT
  USING (is_active AND start_date <= current_date AND end_date >= current_date);

-- سياسات coupon_usages
CREATE POLICY "Users can view their coupon usage"
  ON public.coupon_usages
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their coupon usage"
  ON public.coupon_usages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all coupon usages"
  ON public.coupon_usages
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
