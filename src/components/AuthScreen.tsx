
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (!success) {
          alert('بيانات الدخول غير صحيحة');
        }
      } else {
        if (!formData.name || !formData.email || !formData.password || !formData.birthDate) {
          alert('يرجى ملء جميع الحقول');
          setLoading(false);
          return;
        }
        
        const success = await register(formData.name, formData.email, formData.password, formData.birthDate);
        if (success) {
          alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '', birthDate: '' });
        }
      }
    } catch (error) {
      alert('حدث خطأ، يرجى المحاولة مرة أخرى');
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">متجر</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">الاسم</label>
                <Input
                  type="text"
                  placeholder="أدخل اسمك"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="border-gray-200 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
              <Input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-gray-200 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
              <Input
                type="password"
                placeholder="أدخل كلمة المرور"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="border-gray-200 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">تاريخ الميلاد</label>
                <Input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="border-gray-200 focus:border-blue-500 transition-colors"
                  required
                />
                <p className="text-xs text-gray-500">*يجب أن يكون عمرك 18 عاماً أو أكثر</p>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? 'جاري المعالجة...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
            </Button>
          </form>
          
          <div className="text-center pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '', birthDate: '' });
              }}
              className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
            >
              {isLogin ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'لديك حساب؟ تسجيل الدخول'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;
