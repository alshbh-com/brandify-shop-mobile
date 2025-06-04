
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { ShoppingBag } from 'lucide-react';
import StoreHeader from './StoreHeader';
import OffersSection from './OffersSection';
import CategoryFilter from './CategoryFilter';
import ProductGrid from './ProductGrid';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const { 
    products, 
    categories, 
    storeName, 
    adminLogin
  } = useApp();

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'غير محدد';
  };

  const filteredProducts = products.filter(product => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 pb-20">
      {/* Header الجديد */}
      <StoreHeader
        storeName={storeName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdminClick={() => setShowAdminLogin(true)}
      />

      {/* قسم العروض المميزة */}
      <OffersSection />

      {/* فاصل مرئي */}
      <div className="px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      {/* فلتر الأقسام */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        productsCount={filteredProducts.length}
      />

      {/* شبكة المنتجات */}
      <div className="px-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              جميع المنتجات
            </h2>
          </div>
          <div className="text-sm text-gray-500">
            {filteredProducts.length} من أصل {products.length} منتج
          </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <ProductGrid
            products={filteredProducts}
            getCategoryName={getCategoryName}
          />
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500">جرب البحث بكلمات مختلفة أو اختر قسم آخر</p>
          </div>
        )}
      </div>

      {/* نافذة دخول الإدارة */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">دخول الإدارة</h3>
              <p className="text-purple-100 text-sm mt-1">أدخل كلمة المرور للوصول لوحة التحكم</p>
            </div>
            <CardContent className="p-6">
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mb-6 rounded-2xl border-gray-200 focus:ring-2 focus:ring-purple-500 py-3"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl shadow-lg py-3 font-semibold"
                >
                  دخول
                </Button>
                <Button
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword('');
                  }}
                  variant="outline"
                  className="flex-1 rounded-2xl border-gray-200 hover:bg-gray-50 py-3"
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
