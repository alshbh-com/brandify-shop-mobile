
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  name: string;
  birth_date: string;
  profile_image: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        // Create a fallback profile from user metadata if database profile doesn't exist
        const fallbackProfile: Profile = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'مستخدم جديد',
          birth_date: user.user_metadata?.birth_date || new Date().toISOString().split('T')[0],
          profile_image: '/placeholder.svg'
        };
        setProfile(fallbackProfile);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Provide fallback profile
      if (user) {
        const fallbackProfile: Profile = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'مستخدم جديد',
          birth_date: user.user_metadata?.birth_date || new Date().toISOString().split('T')[0],
          profile_image: '/placeholder.svg'
        };
        setProfile(fallbackProfile);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refetchProfile: fetchProfile
  };
};
