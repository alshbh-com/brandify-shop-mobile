
import React, { useState, useEffect } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductGrid from './ProductGrid';
import { useApp } from '@/contexts/AppContext';

interface SubcategoryProductsScreenProps {
  subcategoryId: string;
  subcategoryName: string;
  subcategoryLogo: string;
  subcategoryBanner: string;
  onBack: () => void;
}

const SubcategoryProductsScreen = ({
  subcategoryId,
  subcategoryName,
  subcategoryLogo,
  subcategoryBanner,
  onBack
}: SubcategoryProductsScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { products, categories } = useApp();
  
  const subcategoryProducts = products.filter(product => 
    (product as any).subcategory_id === subcategoryId
  );

  const filteredProducts = subcategoryProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'غير محدد';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Header */}
      <div className="relative">
        <div className="aspect-[16/6] relative overflow-hidden">
          <img
            src={subcategoryBanner}
            alt={subcategoryName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          {/* Back Button */}
          <Button
            onClick={onBack}
            variant="ghost"
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full w-12 h-12 p-0"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
          
          {/* Store Info */}
          <div className="absolute bottom-6 right-6 flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full p-2 shadow-lg">
              <img
                src={subcategoryLogo}
                alt={`${subcategoryName} logo`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">{subcategoryName}</h1>
              <p className="text-white/80">
                {filteredProducts.length} منتج متوفر
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 bg-white border-b">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="ابحث في المنتجات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-12 rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        {filteredProducts.length > 0 ? (
          <ProductGrid
            products={filteredProducts}
            getCategoryName={getCategoryName}
          />
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500">جرب البحث بكلمات مختلفة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcategoryProductsScreen;
