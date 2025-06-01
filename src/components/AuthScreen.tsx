
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
  const [error, setError] = useState('');
  
  const { signIn, signUp } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        if (!formData.name || !formData.email || !formData.password || !formData.birthDate) {
          setError('يرجى ملء جميع الحقول');
          return;
        }
        
        await signUp(formData.name, formData.email, formData.password, formData.birthDate);
        setError('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '', birthDate: '' });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.message.includes('Invalid login credentials')) {
        setError('بيانات الدخول غير صحيحة');
      } else if (error.message.includes('User already registered')) {
        setError('هذا البريد الإلكتروني مسجل مسبقاً');
      } else {
        setError(error.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
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
          {error && (
            <div className={`p-3 rounded-lg text-sm ${
              error.includes('بنجاح') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {error}
            </div>
          )}
          
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
                setError('');
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
