
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StoreSettings {
  id: string;
  store_name: string;
  welcome_image: string;
  admin_password: string;
}

export const useStoreSettings = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching store settings:', error);
        return;
      }

      setSettings(data);
    } catch (error) {
      console.error('Error fetching store settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<StoreSettings>) => {
    if (!settings) return;

    try {
      const { data, error } = await supabase
        .from('store_settings')
        .update(updates)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      return data;
    } catch (error) {
      console.error('Error updating store settings:', error);
      throw error;
    }
  };

  const checkAdminPassword = (password: string): boolean => {
    return settings?.admin_password === password;
  };

  return {
    settings,
    loading,
    updateSettings,
    checkAdminPassword,
    refetchSettings: fetchSettings
  };
};
