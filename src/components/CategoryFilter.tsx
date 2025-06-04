
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  categories: any[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  productsCount: number;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, productsCount }: CategoryFilterProps) => {
  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              تصفح الأقسام
            </h2>
            <p className="text-gray-500 text-sm">اكتشف مجموعتنا المتنوعة</p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <Sparkles className="w-3 h-3 mr-1" />
          {productsCount} منتج
        </Badge>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-6 py-4 rounded-2xl whitespace-nowrap text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl border-2 ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-200 shadow-purple-200 transform scale-105'
              : 'bg-white text-gray-700 border-gray-100 hover:border-purple-200 hover:shadow-md hover:scale-105'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${selectedCategory === 'all' ? 'bg-white' : 'bg-purple-400'}`}></div>
            جميع المنتجات
          </div>
        </button>
        
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-6 py-4 rounded-2xl whitespace-nowrap text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl border-2 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-200 shadow-purple-200 transform scale-105'
                : 'bg-white text-gray-700 border-gray-100 hover:border-purple-200 hover:shadow-md hover:scale-105'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${selectedCategory === category.id ? 'bg-white' : 'bg-purple-400'}`}></div>
              {category.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
