
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useThemes } from '@/hooks/useThemes';
import { Check, Palette } from 'lucide-react';

const ThemeManager = () => {
  const { themes, currentTheme, changeTheme } = useThemes();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
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
                currentTheme.id === theme.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => changeTheme(theme.id)}
            >
              {currentTheme.id === theme.id && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                  <Check size={12} />
                </div>
              )}
              
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">{theme.name}</h3>
                <p className="text-sm text-gray-600">{theme.preview}</p>
                
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
                  variant={currentTheme.id === theme.id ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    changeTheme(theme.id);
                  }}
                >
                  {currentTheme.id === theme.id ? 'مُطبق حالياً' : 'تطبيق التصميم'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 text-white rounded-full p-1 mt-1">
              <Palette size={12} />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">ملاحظة مهمة</h4>
              <p className="text-sm text-blue-700 mt-1">
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
