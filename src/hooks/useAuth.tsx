
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
          store_name: additionalData?.storeName || ''
        }
      }
    });

    if (error) throw error;

    // إذا تم إنشاء المستخدم بنجاح، قم بإنشاء البروفايل وإضافة الأدوار
    if (data.user) {
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
      } else {
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: 'user'
        });
      }
    }

    return data;
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
