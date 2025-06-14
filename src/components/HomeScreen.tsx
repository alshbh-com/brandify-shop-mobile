
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useSubcategories } from '@/hooks/useSubcategories';
import { ShoppingBag, AlertCircle, Sparkles, Zap } from 'lucide-react';
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
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 animate-pulse"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsLjAzKSIvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwuMDUpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-30"></div>
      
      {/* المحتوى الرئيسي */}
      <div className="relative z-10">
        {/* Header المحدث */}
        <StoreHeader
          storeName={storeName}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdminClick={() => setShowAdminLogin(true)}
        />

        {/* تحذير عند وجود منتجات في السلة */}
        {currentMerchantId && cart.length > 0 && (
          <div className="px-6 mb-6">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-3xl p-6 flex items-start gap-4 shadow-2xl">
              <div className="bg-white/20 rounded-full p-2">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg mb-2">🛍️ تسوق ذكي!</p>
                <p className="text-white/90 text-sm mb-3">
                  يتم عرض منتجات تاجر واحد فقط لتجنب الخلط في الطلبات
                </p>
                <p className="text-white/80 text-xs">
                  لرؤية منتجات تجار آخرين، قم بإفراغ السلة أولاً
                </p>
              </div>
              <Button
                onClick={clearCart}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm px-6 py-2 rounded-2xl font-bold"
              >
                🗑️ إفراغ السلة
              </Button>
            </div>
          </div>
        )}

        {/* قسم العروض المميزة المحدث */}
        <OffersSection />

        {/* فاصل مضيء */}
        <div className="px-6 my-8">
          <div className="h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full shadow-lg"></div>
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
                <div className="w-2 h-12 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full animate-pulse"></div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    ✨ {getCategoryName(selectedCategory)} ✨
                  </h2>
                  <p className="text-white/80 text-lg font-semibold">اكتشف أفضل المتاجر</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-2xl font-bold shadow-lg">
                {currentSubcategories.length} متجر 🏪
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
                <div className="w-2 h-12 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full animate-pulse"></div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                    🛍️ {currentMerchantId ? 'منتجات التاجر المختار' : 'جميع المنتجات'} 🛍️
                  </h2>
                  <p className="text-white/80 text-lg font-semibold">تسوق من أفضل المنتجات</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-2xl font-bold shadow-lg">
                {filteredProducts.length} من {availableProducts.length} منتج 📦
              </div>
            </div>
            
            {filteredProducts.length > 0 ? (
              <ProductGrid
                products={filteredProducts}
                getCategoryName={getCategoryName}
              />
            ) : (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 w32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <ShoppingBag className="w-16 h-16 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">😔 لا توجد منتجات</h3>
                <p className="text-white/80 text-lg">جرب البحث بكلمات مختلفة أو اختر قسم آخر</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* نافذة دخول الإدارة المحدثة */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-center relative">
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">🔐 دخول الإدارة</h3>
                <p className="text-purple-100 font-semibold">أدخل كلمة المرور للوصول لوحة التحكم</p>
              </div>
            </div>
            <CardContent className="p-8 bg-white">
              <Input
                type="password"
                placeholder="🔑 كلمة المرور"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mb-6 rounded-2xl border-2 border-purple-200 focus:border-purple-500 py-4 text-lg font-semibold"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
              <div className="flex gap-4">
                <Button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl shadow-xl py-4 font-black text-lg"
                >
                  ✨ دخول
                </Button>
                <Button
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword('');
                  }}
                  variant="outline"
                  className="flex-1 rounded-2xl border-2 border-gray-300 hover:bg-gray-100 py-4 font-bold text-lg"
                >
                  ❌ إلغاء
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
