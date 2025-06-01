
import React, { createContext, useContext, ReactNode } from 'react';
import { useSettings } from '@/hooks/useSettings';

interface SettingsContextType {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'system';
  updateLanguage: (language: 'ar' | 'en') => void;
  updateTheme: (theme: 'light' | 'dark' | 'system') => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsProvider');
  }
  return context;
};

const translations = {
  ar: {
    // Welcome Screen
    welcomeTitle: 'مرحباً بك في',
    welcomeGreeting: 'أهلاً وسهلاً،',
    welcomeDescription: 'استمتع بتجربة تسوق مميزة مع أفضل البرندات العالمية',
    startShopping: 'ابدأ التسوق',
    loading: 'جاري التحميل...',
    dearCustomer: 'عزيزنا العميل',
    
    // Profile Screen
    profile: 'الحساب الشخصي',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    birthDate: 'تاريخ الميلاد',
    age: 'العمر',
    years: 'سنة',
    editInfo: 'تعديل المعلومات',
    save: 'حفظ',
    cancel: 'إلغاء',
    logout: 'تسجيل الخروج',
    
    // Settings
    settings: 'الإعدادات',
    language: 'اللغة',
    arabic: 'العربية',
    english: 'الإنجليزية',
    theme: 'المظهر',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الداكن',
    systemMode: 'نفس النظام',
    
    // Validation Messages
    fillAllFields: 'يرجى ملء جميع الحقول المطلوبة',
    ageRestriction: 'عذراً، يجب أن يكون عمرك 18 عاماً أو أكثر',
    changesSaved: 'تم حفظ التغييرات بنجاح'
  },
  en: {
    // Welcome Screen
    welcomeTitle: 'Welcome to',
    welcomeGreeting: 'Hello,',
    welcomeDescription: 'Enjoy a unique shopping experience with the best international brands',
    startShopping: 'Start Shopping',
    loading: 'Loading...',
    dearCustomer: 'Dear Customer',
    
    // Profile Screen
    profile: 'Profile',
    name: 'Name',
    email: 'Email',
    birthDate: 'Birth Date',
    age: 'Age',
    years: 'years old',
    editInfo: 'Edit Information',
    save: 'Save',
    cancel: 'Cancel',
    logout: 'Logout',
    
    // Settings
    settings: 'Settings',
    language: 'Language',
    arabic: 'Arabic',
    english: 'English',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    systemMode: 'System Default',
    
    // Validation Messages
    fillAllFields: 'Please fill in all required fields',
    ageRestriction: 'Sorry, you must be 18 years old or older',
    changesSaved: 'Changes saved successfully'
  }
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useSettings();

  const updateLanguage = (language: 'ar' | 'en') => {
    updateSettings({ language });
  };

  const updateTheme = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  const t = (key: string): string => {
    return translations[settings.language][key] || key;
  };

  const value: SettingsContextType = {
    language: settings.language,
    theme: settings.theme,
    updateLanguage,
    updateTheme,
    t
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
