
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
      console.log('🔄 Fetching store settings...');
      
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching store settings:', error);
        // إنشاء إعدادات افتراضية إذا لم توجد
        await createDefaultSettings();
        return;
      }

      if (data) {
        console.log('✅ Store settings loaded:', data);
        setSettings(data);
      } else {
        console.log('⚠️ No settings found, creating default...');
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('💥 Critical error fetching store settings:', error);
      await createDefaultSettings();
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      const defaultSettings = {
        id: 'default',
        store_name: 'متجر البرندات',
        welcome_image: '/placeholder.svg',
        admin_password: 'alshbh01278006248alshbh',
        theme_id: 1
      };

      const { data, error } = await supabase
        .from('store_settings')
        .insert([defaultSettings])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating default settings:', error);
        // استخدم الإعدادات الافتراضية حتى لو فشل الإدراج
        setSettings(defaultSettings);
      } else {
        console.log('✅ Default settings created:', data);
        setSettings(data);
      }
    } catch (error) {
      console.error('💥 Error creating default settings:', error);
      // استخدم الإعدادات الافتراضية كحل أخير
      setSettings({
        id: 'default',
        store_name: 'متجر البرندات',
        welcome_image: '/placeholder.svg',
        admin_password: 'alshbh01278006248alshbh',
        theme_id: 1
      });
    }
  };

  const updateSettings = async (updates: Partial<StoreSettings>) => {
    if (!settings) return;

    try {
      const updatedSettings = { ...settings, ...updates };
      setSettings(updatedSettings);

      const { data, error } = await supabase
        .from('store_settings')
        .update(updates)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) {
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
    console.log('🔐 Checking admin password...');
    console.log('Input password:', password);
    console.log('Stored password:', settings?.admin_password);
    
    if (!settings) {
      console.log('❌ No settings found');
      return false;
    }
    
    const storedPassword = settings.admin_password.trim();
    const inputPassword = password.trim();
    const isValid = storedPassword === inputPassword;
    
    console.log('Password match result:', isValid);
    console.log('Stored (trimmed):', storedPassword);
    console.log('Input (trimmed):', inputPassword);
    
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
