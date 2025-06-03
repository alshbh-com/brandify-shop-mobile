
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { themes, getThemeById } from '@/data/themes';
import { Check, Palette } from 'lucide-react';

const ThemeManager = () => {
  const { settings, updateSettings } = useStoreSettings();
  const currentThemeId = settings?.theme_id || 1;
  const currentTheme = getThemeById(currentThemeId);

  const applyThemeImmediately = (theme: any) => {
    const root = document.documentElement;
    
    console.log('تطبيق التصميم فوراً:', theme.name);
    
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
    
    // تطبيق التصميم على body مباشرة
    document.body.style.background = theme.colors.background;
    document.body.style.color = theme.colors.text;
    
    // إضافة كلاس للتطبيق
    document.body.className = `theme-${theme.id}`;
    
    console.log('تم تطبيق التصميم على المستند:', theme.name);
  };

  const changeTheme = async (themeId: number) => {
    try {
      console.log('تغيير التصميم إلى:', themeId);
      
      // تطبيق التصميم فوراً قبل حفظه
      const newTheme = getThemeById(themeId);
      applyThemeImmediately(newTheme);
      
      // حفظ التصميم في قاعدة البيانات
      await updateSettings({ theme_id: themeId });
      
      console.log('تم تطبيق وحفظ التصميم بنجاح:', newTheme.name);
      
    } catch (error) {
      console.error('خطأ في تحديث التصميم:', error);
    }
  };

  return (
    <Card className="theme-surface-bg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 theme-text">
          <Palette size={20} />
          تصميمات المتجر
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                currentThemeId === theme.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{
                borderColor: currentThemeId === theme.id ? theme.colors.primary : undefined,
                backgroundColor: currentThemeId === theme.id ? theme.colors.accent : undefined
              }}
              onClick={() => changeTheme(theme.id)}
            >
              {currentThemeId === theme.id && (
                <div 
                  className="absolute top-2 right-2 text-white rounded-full p-1"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Check size={12} />
                </div>
              )}
              
              <div className="space-y-3">
                <h3 className="font-semibold text-lg theme-text">{theme.name}</h3>
                <p className="text-sm theme-text-secondary">{theme.preview}</p>
                
                {/* معاينة الألوان */}
                <div className="flex gap-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="اللون الأساسي"
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="اللون الثانوي"
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.colors.accent }}
                    title="لون التمييز"
                  />
                </div>
                
                {/* معاينة التدرج */}
                <div
                  className="h-12 rounded-lg"
                  style={{ background: theme.gradients.header }}
                />
                
                <Button
                  variant={currentThemeId === theme.id ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  style={{
                    background: currentThemeId === theme.id ? theme.gradients.button : undefined,
                    color: currentThemeId === theme.id ? 'white' : undefined
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeTheme(theme.id);
                  }}
                >
                  {currentThemeId === theme.id ? 'مُطبق حالياً' : 'تطبيق التصميم'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 rounded-lg theme-accent-bg">
          <div className="flex items-start gap-3">
            <div className="theme-primary-bg text-white rounded-full p-1 mt-1">
              <Palette size={12} />
            </div>
            <div>
              <h4 className="font-semibold theme-text">ملاحظة مهمة</h4>
              <p className="text-sm theme-text-secondary mt-1">
                عند تغيير التصميم، سيتم تطبيقه على جميع المستخدمين فوراً. 
                التصميم المختار سيظهر لجميع العملاء عند زيارة المتجر.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeManager;
