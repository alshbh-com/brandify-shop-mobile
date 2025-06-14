
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useOffers } from '@/hooks/useOffers';
import { Star, Zap, Clock, Gift, Percent } from 'lucide-react';

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
      {/* عنوان مميز للعروض */}
      <div className="text-center mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent blur-xl"></div>
        <div className="relative">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-3xl shadow-2xl animate-bounce mb-4">
            <Zap className="w-8 h-8" />
            <h2 className="text-3xl font-black text-white">عروض خاصة</h2>
            <Gift className="w-8 h-8" />
          </div>
          <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔥 أفضل العروض الحصرية لفترة محدودة! 🔥
          </p>
        </div>
      </div>

      {/* شبكة العروض */}
      <div className="grid grid-cols-1 gap-8">
        {activeOffers.map((product: any) => {
          const originalPrice = product.price;
          const discountedPrice = originalPrice * (1 - product.offer.discount_percentage / 100);
          const savings = originalPrice - discountedPrice;
          
          return (
            <Card key={product.id} className="offer-card overflow-hidden border-0 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600">
              <CardContent className="p-0 relative">
                {/* شريط الخصم المتحرك */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 animate-pulse"></div>
                
                <div className="flex relative z-10">
                  {/* صورة المنتج مع تأثيرات */}
                  <div className="relative w-40 h-40 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* شارة الخصم */}
                    <div className="absolute top-3 left-3">
                      <div className="offer-badge flex items-center gap-1">
                        <Percent className="w-4 h-4" />
                        <span className="text-sm">خصم {product.offer.discount_percentage}%</span>
                      </div>
                    </div>
                    
                    {/* أيقونة النجمة */}
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-yellow-400 text-yellow-900 rounded-full p-2 shadow-lg animate-pulse">
                        <Star className="w-4 h-4" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  
                  {/* محتوى المنتج */}
                  <div className="flex-1 p-6 text-white">
                    <div className="mb-4">
                      <h3 className="font-black text-2xl text-white mb-2 drop-shadow-lg">
                        {product.name}
                      </h3>
                      <p className="text-white/90 text-sm mb-3 font-medium">
                        {product.description || 'منتج مميز بجودة عالية وخصم استثنائي'}
                      </p>
                      
                      {/* مؤقت العرض */}
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 mb-4">
                        <Clock className="w-4 h-4 text-red-300 animate-pulse" />
                        <span className="text-sm font-bold text-white">
                          ينتهي في: {new Date(product.offer.end_date).toLocaleDateString('ar')}
                        </span>
                      </div>
                    </div>
                    
                    {/* الأسعار والزر */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="offer-original-price text-lg">
                            {originalPrice.toFixed(2)} ر.س
                          </span>
                          <Badge className="bg-red-500 text-white px-2 py-1 text-xs">
                            وفر {savings.toFixed(2)} ر.س
                          </Badge>
                        </div>
                        <div className="offer-price text-4xl font-black text-white drop-shadow-lg">
                          {discountedPrice.toFixed(2)} ر.س
                        </div>
                      </div>
                      
                      <button
                        onClick={() => addToCart({ ...product, price: discountedPrice })}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 text-lg"
                      >
                        🛒 أضف للسلة
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* تأثيرات الخلفية */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-600/20 to-blue-600/20 animate-pulse"></div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* رسالة تحفيزية */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg animate-pulse">
          <span className="text-lg font-bold">⚡ اطلب الآن قبل انتهاء العروض! ⚡</span>
        </div>
      </div>
    </div>
  );
};

export default OffersSection;
