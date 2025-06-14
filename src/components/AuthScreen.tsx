
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { Eye, EyeOff, Upload, Store } from 'lucide-react';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    userType: 'user',
    whatsappNumber: '',
    storeName: '',
    storeLogo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp } = useAuth();
  const { login } = useApp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, storeLogo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (): string | null => {
    if (!isLogin) {
      if (!formData.name) return 'الاسم مطلوب';
      if (!formData.birthDate) return 'تاريخ الميلاد مطلوب';
      if (formData.userType === 'merchant' && !formData.storeName) return 'اسم المتجر مطلوب';
    }
    if (!formData.email) return 'البريد الإلكتروني مطلوب';
    if (!formData.password) return 'كلمة المرور مطلوبة';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { user } = await signIn(formData.email, formData.password);
        if (user) {
          login(user);
        }
      } else {
        if (!formData.name || !formData.birthDate) {
          throw new Error('يرجى ملء جميع الحقول المطلوبة');
        }
        
        const additionalData = {
          userType: formData.userType,
          whatsappNumber: formData.whatsappNumber,
          storeName: formData.storeName,
          storeLogo: formData.storeLogo
        };
        
        const { user } = await signUp(
          formData.name,
          formData.email,
          formData.password,
          formData.birthDate,
          additionalData
        );
        
        if (user) {
          login(user);
        }
      }
    } catch (error: any) {
      setError(error.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">الاسم الكامل *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ الميلاد *</label>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">نوع الحساب</label>
                  <select
                    value={formData.userType}
                    onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="user">عميل</option>
                    <option value="merchant">تاجر</option>
                  </select>
                </div>
                
                {formData.userType === 'merchant' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">رقم الواتساب</label>
                      <Input
                        type="tel"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                        placeholder="مثال: 201234567890"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">اسم المتجر *</label>
                      <Input
                        value={formData.storeName}
                        onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                        placeholder="اسم متجرك"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">شعار/لوجو المتجر</label>
                      {formData.storeLogo && (
                        <div className="mb-3">
                          <img
                            src={formData.storeLogo}
                            alt="Store Logo Preview"
                            className="w-20 h-20 object-cover rounded-lg border mx-auto"
                          />
                        </div>
                      )}
                      <label className="flex items-center justify-center gap-2 bg-green-50 border-2 border-dashed border-green-300 py-4 px-4 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                        <Store size={20} className="text-green-500" />
                        <span className="text-green-600 font-medium">رفع شعار المتجر</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        يمكنك رفع الصورة من الهاتف أو الكمبيوتر
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">البريد الإلكتروني *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">كلمة المرور *</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'جاري التحميل...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline"
              >
                {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;
