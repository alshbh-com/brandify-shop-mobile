
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useSubcategories } from '@/hooks/useSubcategories';
import { ShoppingBag, AlertCircle, Sparkles, Settings } from 'lucide-react';
import StoreHeader from './StoreHeader';
import OffersSection from './OffersSection';
import CategoryFilter from './CategoryFilter';
import ProductGrid from './ProductGrid';
import SubcategoryGrid from './SubcategoryGrid';
import SubcategoryProductsScreen from './SubcategoryProductsScreen';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const { 
    categories, 
    storeName, 
    adminLogin,
    currentMerchantId,
    getFilteredProducts,
    cart,
    clearCart
  } = useApp();

  const { subcategories, getSubcategoriesByCategory } = useSubcategories();

  // استخدام المنتجات المفلترة بدلاً من جميع المنتجات
  const availableProducts = getFilteredProducts();

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'غير محدد';
  };

  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdminLogin = () => {
    if (adminLogin(adminPassword)) {
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('كلمة مرور خاطئة');
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  };

  const handleBackFromSubcategory = () => {
    setSelectedSubcategory(null);
  };

  // إذا تم اختيار قسم فرعي، اعرض منتجاته
  if (selectedSubcategory) {
    const subcategory = subcategories.find(s => s.id === selectedSubcategory);
    if (subcategory) {
      return (
        <SubcategoryProductsScreen
          subcategoryId={selectedSubcategory}
          subcategoryName={subcategory.name}
          subcategoryLogo={subcategory.logo}
          subcategoryBanner={subcategory.banner_image}
          onBack={handleBackFromSubcategory}
        />
      );
    }
  }

  // الحصول على الأقسام الفرعية للقسم المختار
  const currentSubcategories = selectedCategory !== 'all' 
    ? getSubcategoriesByCategory(selectedCategory)
    : [];

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <StoreHeader
        storeName={storeName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdminClick={() => setShowAdminLogin(true)}
      />

      {/* تحذير عند وجود منتجات في السلة */}
      {currentMerchantId && cart.length > 0 && (
        <div className="px-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-4">
            <div className="bg-blue-100 rounded-full p-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-blue-800 mb-2">تسوق ذكي!</p>
              <p className="text-blue-700 text-sm mb-3">
                يتم عرض منتجات تاجر واحد فقط لتجنب الخلط في الطلبات
              </p>
              <p className="text-blue-600 text-xs">
                لرؤية منتجات تجار آخرين، قم بإفراغ السلة أولاً
              </p>
            </div>
            <Button
              onClick={clearCart}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              إفراغ السلة
            </Button>
          </div>
        </div>
      )}

      {/* قسم العروض المميزة */}
      <OffersSection />

      {/* فاصل */}
      <div className="px-6 my-8">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
      </div>

      {/* فلتر الأقسام */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        productsCount={filteredProducts.length}
      />

      {/* عرض الأقسام الفرعية */}
      {selectedCategory !== 'all' && currentSubcategories.length > 0 && (
        <div className="px-6 pb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {getCategoryName(selectedCategory)}
                </h2>
                <p className="text-slate-600">اكتشف أفضل المتاجر</p>
              </div>
            </div>
            <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-semibold">
              {currentSubcategories.length} متجر
            </div>
          </div>
          
          <SubcategoryGrid
            subcategories={currentSubcategories}
            onSubcategorySelect={handleSubcategorySelect}
          />
        </div>
      )}

      {/* شبكة المنتجات */}
      {(selectedCategory === 'all' || currentSubcategories.length === 0) && (
        <div className="px-6 pb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {currentMerchantId ? 'منتجات التاجر المختار' : 'جميع المنتجات'}
                </h2>
                <p className="text-slate-600">تسوق من أفضل المنتجات</p>
              </div>
            </div>
            <div className="bg-teal-100 text-teal-700 px-4 py-2 rounded-lg font-semibold">
              {filteredProducts.length} من {availableProducts.length} منتج
            </div>
          </div>
          
          {filteredProducts.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              getCategoryName={getCategoryName}
            />
          ) : (
            <div className="text-center py-20">
              <div className="bg-slate-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-16 h-16 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-4">لا توجد منتجات</h3>
              <p className="text-slate-500">جرب البحث بكلمات مختلفة أو اختر قسم آخر</p>
            </div>
          )}
        </div>
      )}

      {/* نافذة دخول الإدارة */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center rounded-t-lg">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">دخول الإدارة</h3>
              <p className="text-indigo-100">أدخل كلمة المرور للوصول لوحة التحكم</p>
            </div>
            <CardContent className="p-6">
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mb-6"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleAdminLogin}
                  className="flex-1"
                >
                  دخول
                </Button>
                <Button
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
