
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useOffers } from '@/hooks/useOffers';
import { Star, Zap, Clock } from 'lucide-react';

const OffersSection = () => {
  const { products, addToCart } = useApp();
  const { offers } = useOffers();
  
  // فلترة العروض النشطة والحصول على تفاصيل المنتجات
  const activeOffers = offers
    .filter(offer => offer.is_active && new Date(offer.end_date) > new Date())
    .map(offer => {
      const product = products.find(p => p.id === offer.product_id);
      return product ? { ...product, offer } : null;
    })
    .filter(Boolean)
    .slice(0, 3);

  if (activeOffers.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              عروض مميزة
            </h2>
            <p className="text-gray-500 text-sm">أفضل العروض الحصرية لك</p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <Clock className="w-3 h-3 mr-1" />
          عرض محدود
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activeOffers.map((product: any) => {
          const originalPrice = product.price;
          const discountedPrice = originalPrice * (1 - product.offer.discount_percentage / 100);
          
          return (
            <Card key={product.id} className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="relative w-32 h-32">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
                        خصم {product.offer.discount_percentage}%
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <div className="bg-amber-400 text-white rounded-full p-1">
                        <Star className="w-3 h-3" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {product.description || 'منتج مميز بجودة عالية'}
                      </p>
                      <p className="text-xs text-gray-500">
                        العرض ينتهي في: {new Date(product.offer.end_date).toLocaleDateString('ar')}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 line-through">
                          {originalPrice.toFixed(2)} ر.س
                        </span>
                        <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                          {discountedPrice.toFixed(2)} ر.س
                        </span>
                      </div>
                      
                      <button
                        onClick={() => addToCart({ ...product, price: discountedPrice })}
                        className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-6 py-2 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        أضف للسلة
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OffersSection;
