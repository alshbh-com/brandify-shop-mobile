
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { Eye, EyeOff, Upload, Store, AlertCircle, User, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    userType: 'customer', // Changed default to customer
    whatsappNumber: '',
    storeName: '',
    storeLogo: '',
    storeCategory: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimitError, setRateLimitError] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { login } = useApp();

  // تحميل الأقسام الرئيسية عند تحميل المكون
  useEffect(() => {
    const fetchCategories = async () => {
      console.log('Starting to fetch categories...');
      setCategoriesLoading(true);
      setCategoriesError('');
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        console.log('Supabase response:', { data, error });
        
        if (error) {
          console.error('Error fetching categories:', error);
          setCategoriesError('خطأ في تحميل الأقسام');
        } else {
          console.log('Categories fetched successfully:', data);
          setCategories(data || []);
          
          if (!data || data.length === 0) {
            console.warn('No categories found in database');
            setCategoriesError('لا توجد أقسام في قاعدة البيانات');
          }
        }
      } catch (error) {
        console.error('Unexpected error fetching categories:', error);
        setCategoriesError('خطأ غير متوقع في تحميل الأقسام');
      } finally {
        setCategoriesLoading(false);
      }
    };

    // تحميل الأقسام فقط عند التسجيل الجديد وكان نوع المستخدم تاجر
    if (!isLogin && formData.userType === 'merchant') {
      fetchCategories();
    }
  }, [isLogin, formData.userType]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRateLimitError(false);
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
        
        if (formData.userType === 'merchant' && (!formData.storeName || !formData.storeCategory)) {
          throw new Error('يرجى ملء اسم المتجر واختيار نوع المتجر');
        }
        
        const additionalData = {
          userType: formData.userType,
          whatsappNumber: formData.whatsappNumber,
          storeName: formData.storeName,
          storeLogo: formData.storeLogo,
          storeCategory: formData.storeCategory
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
      console.error('Auth error:', error);
      
      if (error.message?.includes('over_email_send_rate_limit') || error.message?.includes('rate limit')) {
        setRateLimitError(true);
        setError('تم إرسال كثير من الطلبات. يرجى المحاولة مرة أخرى بعد بضع دقائق.');
      } else if (error.message?.includes('email')) {
        setError('البريد الإلكتروني مستخدم بالفعل أو غير صالح');
      } else if (error.message?.includes('password')) {
        setError('كلمة المرور ضعيفة. يجب أن تكون 6 أحرف على الأقل');
      } else {
        setError(error.message || 'حدث خطأ غير متوقع');
      }
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
              <div className={`border px-4 py-3 rounded flex items-center gap-2 ${
                rateLimitError 
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {rateLimitError && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
                <strong>نصيحة:</strong> حاول استخدام بريد إلكتروني مختلف أو انتظر 5-10 دقائق قبل المحاولة مرة أخرى.
              </div>
            )}
            
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">الاسم الكامل *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ الميلاد *</label>
                  <Input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">نوع الحساب</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'customer' }))}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                        formData.userType === 'customer'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <User className="w-8 h-8 mb-2" />
                      <span className="font-medium">عميل</span>
                      <span className="text-xs text-gray-500 text-center mt-1">
                        للتسوق والشراء
                      </span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'merchant' }))}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                        formData.userType === 'merchant'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <ShoppingBag className="w-8 h-8 mb-2" />
                      <span className="font-medium">تاجر</span>
                      <span className="text-xs text-gray-500 text-center mt-1">
                        لبيع المنتجات
                      </span>
                    </button>
                  </div>
                </div>
                
                {formData.userType === 'merchant' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">نوع المتجر (القسم الرئيسي) *</label>
                      <select
                        name="storeCategory"
                        value={formData.storeCategory}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        disabled={categoriesLoading}
                      >
                        <option value="">
                          {categoriesLoading ? 'جاري تحميل الأقسام...' : 'اختر القسم الرئيسي لمتجرك'}
                        </option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        سيتم إنشاء متجرك كقسم فرعي داخل القسم الرئيسي المختار
                      </p>
                      {categoriesError && (
                        <p className="text-xs text-red-500 mt-1">
                          {categoriesError}
                        </p>
                      )}
                      {!categoriesLoading && categories.length === 0 && !categoriesError && (
                        <p className="text-xs text-orange-500 mt-1">
                          جاري التحقق من الأقسام المتاحة...
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">رقم الواتساب</label>
                      <Input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleInputChange}
                        placeholder="مثال: 201234567890"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">اسم المتجر *</label>
                      <Input
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleInputChange}
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
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">كلمة المرور *</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
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
