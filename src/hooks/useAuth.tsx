
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const signUp = async (name: string, email: string, password: string, birthDate: string, additionalData?: any) => {
    try {
      const age = calculateAge(birthDate);
      if (age < 18) {
        throw new Error('عذراً، يجب أن يكون عمرك 18 عاماً أو أكثر للتسجيل');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            birth_date: birthDate,
            user_type: additionalData?.userType || 'user',
            whatsapp_number: additionalData?.whatsappNumber || '',
            store_name: additionalData?.storeName || '',
            store_logo: additionalData?.storeLogo || '',
            store_category: additionalData?.storeCategory || ''
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      // إذا تم إنشاء المستخدم بنجاح، قم بإنشاء البروفايل وإضافة الأدوار
      if (data.user) {
        try {
          // إنشاء البروفايل
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name,
            birth_date: birthDate,
            whatsapp_number: additionalData?.whatsappNumber || null,
            merchant_status: additionalData?.userType === 'merchant' ? 'pending' : null
          });

          // إضافة الدور المناسب
          if (additionalData?.userType === 'merchant') {
            await supabase.from('user_roles').insert({
              user_id: data.user.id,
              role: 'merchant'
            });

            // إنشاء القسم الفرعي (المتجر) للتاجر إذا كان اسم المتجر موجود
            if (additionalData?.storeName && additionalData?.storeCategory) {
              try {
                await supabase.from('subcategories').insert({
                  name: additionalData.storeName,
                  description: `متجر ${additionalData.storeName}`,
                  logo: additionalData?.storeLogo || '/placeholder.svg',
                  banner_image: additionalData?.storeLogo || '/placeholder.svg',
                  category_id: additionalData.storeCategory,
                  merchant_id: data.user.id,
                  is_active: true
                });
                
                console.log('تم إنشاء المتجر الفرعي بنجاح:', additionalData.storeName);
              } catch (subcategoryError) {
                console.error('خطأ في إنشاء المتجر الفرعي:', subcategoryError);
                // لا نقطع العملية إذا فشل إنشاء المتجر الفرعي
              }
            }
          } else {
            await supabase.from('user_roles').insert({
              user_id: data.user.id,
              role: 'user'
            });
          }
        } catch (profileError) {
          console.error('خطأ في إنشاء البروفايل:', profileError);
          // نستمر في العملية حتى لو فشل إنشاء البروفايل
        }
      }

      return data;
    } catch (error: any) {
      console.error('SignUp error:', error);
      
      // معالجة أخطاء معدل الطلبات
      if (error.message?.includes('over_email_send_rate_limit') || error.code === 'over_email_send_rate_limit') {
        throw new Error('تم إرسال كثير من الطلبات. يرجى المحاولة مرة أخرى بعد بضع دقائق.');
      }
      
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };
};
