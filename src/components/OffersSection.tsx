
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useOffers } from '@/hooks/useOffers';
import { Star, Clock, ShoppingCart, Zap, Gift, Crown } from 'lucide-react';

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
    <section className="px-6 py-12 bg-gradient-to-r from-purple-50 to-pink-50">
      {/* عنوان مختصر */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            عروض حصرية
          </h2>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
            <Gift className="w-6 h-6 text-white" />
          </div>
        </div>
        <p className="text-gray-600">خصومات استثنائية لفترة محدودة</p>
      </div>

      {/* شبكة العروض المدمجة */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {activeOffers.map((product: any, index: number) => {
          const originalPrice = product.price;
          const discountedPrice = originalPrice * (1 - product.offer.discount_percentage / 100);
          const savings = originalPrice - discountedPrice;
          
          return (
            <Card 
              key={product.id}
              className="group overflow-hidden bg-white/80 backdrop-blur-sm border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1"
            >
              <CardContent className="p-0">
                {/* صورة المنتج */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* شارة الخصم */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-3 py-1 text-sm">
                      -{product.offer.discount_percentage}%
                    </Badge>
                  </div>
                  
                  {/* التقييم */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-yellow-400 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      4.9
                    </div>
                  </div>
                </div>
                
                {/* محتوى البطاقة */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  
                  {/* مؤقت العرض */}
                  <div className="flex items-center gap-2 text-orange-600 text-sm mb-3">
                    <Clock className="w-4 h-4" />
                    <span>ينتهي: {new Date(product.offer.end_date).toLocaleDateString('ar-EG')}</span>
                  </div>
                  
                  {/* الأسعار */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">
                          {discountedPrice.toFixed(2)} ج.م
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {originalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-emerald-600 font-medium">
                        وفر {savings.toFixed(2)} ج.م
                      </div>
                    </div>
                  </div>
                  
                  {/* زر الشراء */}
                  <button
                    onClick={() => addToCart({ ...product, price: discountedPrice })}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                             text-white py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2
                             transition-all duration-300 hover:shadow-lg hover:shadow-purple-200"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    أضف إلى السلة
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* رسالة تشجيعية مختصرة */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 px-6 py-3 rounded-full font-bold border border-orange-200">
          <Zap className="w-5 h-5" />
          <span>عروض محدودة الوقت - اطلب الآن!</span>
          <Gift className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
