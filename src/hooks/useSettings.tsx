
import { useState, useEffect } from 'react';

interface UserSettings {
  language: 'ar' | 'en';
  theme: 'light';
}

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    language: 'ar',
    theme: 'light' // دائماً فاتح
  });

  useEffect(() => {
    // تحميل الإعدادات من localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // التأكد من أن الثيم فاتح دائماً
        setSettings({ ...parsed, theme: 'light' });
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
    
    // تطبيق الثيم الفاتح دائماً
    document.documentElement.classList.remove('dark');
    
    // تطبيق اتجاه اللغة
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
  }, [settings]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    // التأكد من أن الثيم يبقى فاتح
    setSettings(prev => ({ ...prev, ...newSettings, theme: 'light' }));
  };

  return {
    settings,
    updateSettings
  };
};
