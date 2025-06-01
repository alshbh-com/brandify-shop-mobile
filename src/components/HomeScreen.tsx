
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { Plus, Search } from 'lucide-react';

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
      // سيتم التعامل مع عرض لوحة الإدارة في المكون الرئيسي
    } else {
      alert('كلمة مرور خاطئة');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{storeName}</h1>
          <Button
            onClick={() => setShowAdminLogin(true)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            إدارة
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="ابحث عن المنتجات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-white/95 border-0 text-gray-800"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">الأقسام</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            الكل
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">المنتجات</h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <Card key={product.id} className="bg-white shadow-md border-0 overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{getCategoryName(product.category_id)}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    {product.price} ر.س
                  </span>
                  <Button
                    onClick={() => addToCart(product)}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-center mb-4">دخول الإدارة</h3>
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
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
