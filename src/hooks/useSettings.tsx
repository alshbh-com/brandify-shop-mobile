
import { useState, useEffect } from 'react';

interface UserSettings {
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
}

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    language: 'ar',
    theme: 'light' // الوضع الافتراضي فاتح
  });

  useEffect(() => {
    // تحميل الإعدادات من localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    } else {
      // اكتشاف لغة النظام
      const browserLang = navigator.language || navigator.languages[0];
      const detectedLang = browserLang.startsWith('ar') ? 'ar' : 'en';
      setSettings(prev => ({ ...prev, language: detectedLang }));
    }
  }, []);

  useEffect(() => {
    // حفظ الإعدادات في localStorage عند تغييرها
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // تطبيق الثيم
    applyTheme(settings.theme);
    
    // تطبيق اتجاه اللغة
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
  }, [settings]);

  const applyTheme = (theme: 'light' | 'dark') => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleTheme = () => {
    setSettings(prev => ({ 
      ...prev, 
      theme: prev.theme === 'light' ? 'dark' : 'light' 
    }));
  };

  return {
    settings,
    updateSettings,
    toggleTheme
  };
};
