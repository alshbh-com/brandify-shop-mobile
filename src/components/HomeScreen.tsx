
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { Plus, Search, ShoppingBag } from 'lucide-react';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const { 
    products, 
    categories, 
    addToCart, 
    storeName, 
    adminLogin,
    isAdmin 
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
      {/* Header with Logo */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white shadow-2xl">
        <div className="px-6 pt-8 pb-6">
          {/* Store Logo and Name */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{storeName}</h1>
                <p className="text-blue-100 text-sm">أفضل الأسعار والجودة</p>
              </div>
            </div>
            <Button
              onClick={() => setShowAdminLogin(true)}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full px-4"
            >
              إدارة
            </Button>
          </div>
          
          {/* Enhanced Search Bar */}
          <div className="relative">
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <Input
              placeholder="ابحث عن المنتجات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 pl-4 py-3 bg-white/95 backdrop-blur-sm border-0 text-gray-800 rounded-2xl shadow-lg focus:ring-2 focus:ring-white/30 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Categories */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full ml-3"></div>
          الأقسام
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-2xl whitespace-nowrap text-sm font-medium transition-all duration-300 shadow-lg ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-blue-200 transform scale-105'
                : 'bg-white text-gray-600 border border-gray-100 hover:shadow-md hover:scale-105'
            }`}
          >
            الكل
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-2xl whitespace-nowrap text-sm font-medium transition-all duration-300 shadow-lg ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-blue-200 transform scale-105'
                  : 'bg-white text-gray-600 border border-gray-100 hover:shadow-md hover:scale-105'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Products Grid */}
      <div className="px-6 pb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full ml-3"></div>
          المنتجات
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <Card key={product.id} className="bg-white shadow-xl border-0 overflow-hidden rounded-3xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-purple-500 font-medium mb-3">
                  {getCategoryName(product.category_id)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {product.price} ر.س
                    </span>
                  </div>
                  <Button
                    onClick={() => addToCart(product)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full w-10 h-10 p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Enhanced Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm bg-white rounded-3xl shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">دخول الإدارة</h3>
              </div>
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mb-6 rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-2xl shadow-lg"
                >
                  دخول
                </Button>
                <Button
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword('');
                  }}
                  variant="outline"
                  className="flex-1 rounded-2xl border-gray-200 hover:bg-gray-50"
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
