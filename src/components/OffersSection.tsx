
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useOffers } from '@/hooks/useOffers';
import { Star, Clock, Gift, Percent, Zap, Crown } from 'lucide-react';

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
    <div className="px-4 py-8 bg-gradient-to-br from-orange-50 to-red-50">
      {/* عنوان العروض الجديد */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            عروض حصرية
          </h2>
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <Gift className="w-6 h-6 text-white" />
          </div>
        </div>
        <p className="text-lg text-gray-700 font-medium">
          🔥 أقوى العروض والخصومات لفترة محدودة 🔥
        </p>
      </div>

      {/* شبكة العروض المحدثة */}
      <div className="space-y-6">
        {activeOffers.map((product: any) => {
          const originalPrice = product.price;
          const discountedPrice = originalPrice * (1 - product.offer.discount_percentage / 100);
          const savings = originalPrice - discountedPrice;
          
          return (
            <Card key={product.id} className="overflow-hidden border-0 shadow-2xl bg-white hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0">
                <div className="relative">
                  {/* خلفية متدرجة في الأعلى */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500"></div>
                  
                  <div className="flex flex-col md:flex-row">
                    {/* صورة المنتج */}
                    <div className="relative md:w-64 h-64 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* شارة الخصم */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold">
                          <Percent className="w-4 h-4" />
                          <span>خصم {product.offer.discount_percentage}%</span>
                        </div>
                      </div>
                      
                      {/* نجمة الجودة */}
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-yellow-400 text-yellow-900 rounded-full p-3 shadow-lg">
                          <Star className="w-5 h-5 fill-current" />
                        </div>
                      </div>
                    </div>
                    
                    {/* محتوى المنتج */}
                    <div className="flex-1 p-8">
                      <div className="mb-6">
                        <h3 className="text-3xl font-bold text-gray-900 mb-3">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {product.description || 'منتج عالي الجودة بخصم استثنائي لفترة محدودة'}
                        </p>
                      </div>
                      
                      {/* مؤقت العرض */}
                      <div className="flex items-center gap-3 bg-orange-100 rounded-xl px-4 py-3 mb-6">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <span className="text-orange-800 font-semibold">
                          ينتهي العرض: {new Date(product.offer.end_date).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                      
                      {/* الأسعار والزر */}
                      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <span className="text-xl text-gray-500 line-through font-medium">
                              {originalPrice.toFixed(2)} ج.م
                            </span>
                            <Badge className="bg-green-100 text-green-800 px-3 py-1 font-semibold">
                              وفر {savings.toFixed(2)} ج.م
                            </Badge>
                          </div>
                          <div className="text-5xl font-bold text-red-600">
                            {discountedPrice.toFixed(2)} ج.م
                          </div>
                        </div>
                        
                        <button
                          onClick={() => addToCart({ ...product, price: discountedPrice })}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center gap-3 justify-center"
                        >
                          <Zap className="w-5 h-5" />
                          أضف للسلة الآن
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* رسالة تحفيزية */}
      <div className="text-center mt-10">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full shadow-lg font-bold text-lg">
          <Zap className="w-6 h-6" />
          <span>⚡ استغل العروض قبل انتهائها! ⚡</span>
          <Gift className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default OffersSection;
