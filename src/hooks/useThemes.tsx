
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { themes, getThemeById, Theme } from '@/data/themes';

export const useThemes = () => {
  const { settings, updateSettings } = useApp();
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    if (settings?.theme_id) {
      const theme = getThemeById(settings.theme_id);
      setCurrentTheme(theme);
      applyThemeToDocument(theme);
    }
  }, [settings?.theme_id]);

  const applyThemeToDocument = (theme: Theme) => {
    const root = document.documentElement;
    
    // تطبيق متغيرات CSS المخصصة
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-surface', theme.colors.surface);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
    
    // تطبيق التدرجات
    root.style.setProperty('--theme-gradient-header', theme.gradients.header);
    root.style.setProperty('--theme-gradient-card', theme.gradients.card);
    root.style.setProperty('--theme-gradient-button', theme.gradients.button);
  };

  const changeTheme = async (themeId: number) => {
    try {
      await updateSettings({ theme_id: themeId });
      const newTheme = getThemeById(themeId);
      setCurrentTheme(newTheme);
      applyThemeToDocument(newTheme);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  return {
    themes,
    currentTheme,
    changeTheme
  };
};
