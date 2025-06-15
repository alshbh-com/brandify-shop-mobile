
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { Eye, EyeOff, Upload, Store, AlertCircle, User, ShoppingBag, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    userType: 'customer', // العميل هو الافتراضي
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

  // تحميل الأقسام مع معالجة محسنة للأخطاء
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      console.log('🔄 بدء تحميل الأقسام...');
      
      try {
        // استعلام مبسط بدون ترتيب معقد
        const { data, error, count } = await supabase
          .from('categories')
          .select('*', { count: 'exact' });
        
        console.log('📊 استجابة قاعدة البيانات:', {
          data: data,
          error: error,
          count: count,
          dataLength: data?.length
        });
        
        if (error) {
          console.error('❌ خطأ في تحميل الأقسام:', error);
          console.error('تفاصيل الخطأ:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          setCategories([]);
        } else {
          console.log('✅ تم تحميل الأقسام بنجاح');
          console.log('📝 قائمة الأقسام:', data);
          setCategories(data || []);
        }
      } catch (error) {
        console.error('💥 خطأ غير متوقع في تحميل الأقسام:', error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
        console.log('🏁 انتهاء عملية تحميل الأقسام');
      }
    };

    // تحميل الأقسام دائماً
    fetchCategories();
  }, []);

  // إضافة معلومات تشخيصية إضافية
  useEffect(() => {
    console.log('📈 حالة الأقسام الحالية:', {
      categories: categories,
      length: categories.length,
      loading: categoriesLoading,
      userType: formData.userType
    });
  }, [categories, categoriesLoading, formData.userType]);

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
        // التحقق من الحقول الأساسية حسب نوع المستخدم
        if (formData.userType === 'guest') {
          // الضيف يحتاج فقط اسم وتاريخ ميلاد
          if (!formData.name || !formData.birthDate) {
            throw new Error('يرجى ملء الاسم وتاريخ الميلاد');
          }
        } else if (formData.userType === 'customer') {
          // العميل يحتاج اسم وتاريخ ميلاد
          if (!formData.name || !formData.birthDate) {
            throw new Error('يرجى ملء الاسم وتاريخ الميلاد');
          }
        } else if (formData.userType === 'merchant') {
          // التاجر يحتاج كل الحقول
          if (!formData.name || !formData.birthDate) {
            throw new Error('يرجى ملء الاسم وتاريخ الميلاد');
          }
          if (!formData.storeName || !formData.storeCategory) {
            throw new Error('يرجى ملء اسم المتجر واختيار القسم الرئيسي');
          }
          if (categories.length === 0) {
            throw new Error('لا توجد أقسام متاحة حالياً. يرجى المحاولة لاحقاً أو التواصل مع الإدارة');
          }
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
      console.error('خطأ في المصادقة:', error);
      
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
                    placeholder="أدخل اسمك الكامل"
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
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'guest' }))}
                      className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all text-xs ${
                        formData.userType === 'guest'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Users className="w-6 h-6 mb-1" />
                      <span className="font-medium">ضيف</span>
                      <span className="text-xs text-gray-500 text-center mt-1">
                        تسجيل سريع
                      </span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'customer' }))}
                      className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all text-xs ${
                        formData.userType === 'customer'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <User className="w-6 h-6 mb-1" />
                      <span className="font-medium">عميل</span>
                      <span className="text-xs text-gray-500 text-center mt-1">
                        للتسوق
                      </span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'merchant' }))}
                      className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all text-xs ${
                        formData.userType === 'merchant'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <ShoppingBag className="w-6 h-6 mb-1" />
                      <span className="font-medium">تاجر</span>
                      <span className="text-xs text-gray-500 text-center mt-1">
                        للبيع
                      </span>
                    </button>
                  </div>
                </div>
                
                {formData.userType === 'merchant' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">القسم الرئيسي للمتجر *</label>
                      <select
                        name="storeCategory"
                        value={formData.storeCategory}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        disabled={categoriesLoading}
                      >
                        <option value="">
                          {categoriesLoading 
                            ? 'جاري تحميل الأقسام...' 
                            : categories.length === 0 
                              ? 'لا توجد أقسام متاحة - يرجى إعادة المحاولة'
                              : 'اختر القسم الرئيسي لمتجرك'}
                        </option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      
                      {/* حالة التحميل */}
                      {categoriesLoading && (
                        <p className="text-xs text-blue-600 mt-1 bg-blue-50 p-2 rounded">
                          🔄 جاري تحميل الأقسام المتاحة...
                        </p>
                      )}
                      
                      {/* حالة عدم وجود أقسام */}
                      {!categoriesLoading && categories.length === 0 && (
                        <p className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded">
                          ⚠️ لا توجد أقسام في النظام حالياً. يرجى التواصل مع إدارة المتجر.
                        </p>
                      )}
                      
                      {/* حالة وجود أقسام */}
                      {!categoriesLoading && categories.length > 0 && (
                        <p className="text-xs text-green-600 mt-1 bg-green-50 p-2 rounded">
                          ✅ تم العثور على {categories.length} قسم متاح
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">
                        سيتم إنشاء متجرك كقسم فرعي داخل القسم الرئيسي المختار
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">اسم المتجر *</label>
                      <Input
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleInputChange}
                        placeholder="اسم متجرك التجاري"
                        required
                      />
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
                placeholder="example@email.com"
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
                  placeholder="أدخل كلمة مرور قوية"
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
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  يجب أن تكون كلمة المرور 6 أحرف على الأقل
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || (!isLogin && formData.userType === 'merchant' && categories.length === 0)}
            >
              {loading ? 'جاري التحميل...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
            </Button>
            
            {!isLogin && formData.userType === 'merchant' && categories.length === 0 && (
              <p className="text-xs text-orange-600 text-center bg-orange-50 p-2 rounded">
                لا يمكن إنشاء حساب تاجر بدون وجود أقسام في النظام
              </p>
            )}
            
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
