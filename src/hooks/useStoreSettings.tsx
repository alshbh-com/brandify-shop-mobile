import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StoreSettings {
  id: string;
  store_name: string;
  welcome_image: string;
  admin_password: string;
  theme_id: number;
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
        // Provide default settings if none exist
        const defaultSettings: StoreSettings = {
          id: 'default',
          store_name: 'متجر البرندات',
          welcome_image: '/placeholder.svg',
          admin_password: 'alshbh01278006248alshbh',
          theme_id: 1
        };
        setSettings(defaultSettings);
        return;
      }

      if (data) {
        setSettings(data);
      } else {
        // If no data exists, create default settings
        const defaultSettings: StoreSettings = {
          id: 'default',
          store_name: 'متجر البرندات',
          welcome_image: '/placeholder.svg',
          admin_password: 'alshbh01278006248alshbh',
          theme_id: 1
        };
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error fetching store settings:', error);
      // Provide default settings on error
      const defaultSettings: StoreSettings = {
        id: 'default',
        store_name: 'متجر البرندات',
        welcome_image: '/placeholder.svg',
        admin_password: 'alshbh01278006248alshbh',
        theme_id: 1
      };
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<StoreSettings>) => {
    if (!settings) return;

    try {
      // تحديث الحالة المحلية فوراً لتحسين الأداء
      const updatedSettings = { ...settings, ...updates };
      setSettings(updatedSettings);

      const { data, error } = await supabase
        .from('store_settings')
        .update(updates)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) {
        // إذا فشل التحديث، أرجع للحالة السابقة
        setSettings(settings);
        throw error;
      }

      setSettings(data);
      return data;
    } catch (error) {
      console.error('Error updating store settings:', error);
      throw error;
    }
  };

  const checkAdminPassword = (password: string): boolean => {
    console.log('Checking password:', password);
    console.log('Stored password:', settings?.admin_password);
    console.log('Password match:', settings?.admin_password === password);
    
    if (!settings) {
      console.log('No settings found');
      return false;
    }
    
    // تأكد من أن كلمة المرور تتطابق تماماً
    const isValid = settings.admin_password.trim() === password.trim();
    console.log('Final validation result:', isValid);
    return isValid;
  };

  return {
    settings,
    loading,
    updateSettings,
    checkAdminPassword,
    refetchSettings: fetchSettings
  };
};
