
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useRatings } from '@/hooks/useRatings';
import { Plus, Star, Heart } from 'lucide-react';

interface ProductGridProps {
  products: any[];
  getCategoryName: (categoryId: string) => string;
}

const ProductGrid = ({ products, getCategoryName }: ProductGridProps) => {
  const { addToCart } = useApp();
  const { favorites } = useFavorites();
  const { ratings } = useRatings();

  const isFavorite = (productId: string) => {
    return favorites.some(f => f.product_id === productId);
  };

  const isFeatured = (productId: string) => {
    return favorites.some(f => f.product_id === productId && f.is_featured);
  };

  const getProductRating = (productId: string) => {
    return ratings.find(r => r.product_id === productId);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => {
        const productRating = getProductRating(product.id);
        const isProductFavorite = isFavorite(product.id);
        const isProductFeatured = isFeatured(product.id);

        return (
          <Card key={product.id} className="group bg-white shadow-lg border-0 overflow-hidden rounded-3xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="relative">
              <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* شارات المنتج */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {index < 3 && (
                    <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-lg">
                      جديد
                    </Badge>
                  )}
                  {isProductFeatured && (
                    <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white border-0 shadow-lg">
                      مميز
                    </Badge>
                  )}
                </div>
                
                {/* أيقونة الإعجاب */}
                <button className="absolute top-3 left-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
                  <Heart 
                    className={`w-4 h-4 transition-colors ${
                      isProductFavorite ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'
                    }`} 
                  />
                </button>
                
                {/* تقييم المنتج */}
                {productRating && (
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                    <span className="text-xs font-medium text-gray-700">{productRating.rating}</span>
                  </div>
                )}
              </div>
            </div>
            
            <CardContent className="p-5">
              <div className="space-y-3">
                <div>
                  <Badge variant="outline" className="text-xs mb-2 border-gray-200 text-gray-600">
                    {getCategoryName(product.category_id)}
                  </Badge>
                  <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  {productRating?.admin_comment && (
                    <p className="text-xs text-blue-600 italic mt-1">
                      "{productRating.admin_comment}"
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {product.price} ر.س
                    </span>
                    <span className="text-xs text-gray-400">شامل الضريبة</span>
                  </div>
                  
                  <Button
                    onClick={() => addToCart(product)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group-hover:animate-pulse"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductGrid;
