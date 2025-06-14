
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
    <div className="relative mx-6 my-12 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* خلفية متحركة مع تأثيرات بصرية */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-20 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
      </div>

      <div className="relative z-10 p-8 lg:p-12">
        {/* عنوان القسم الأنيق */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-2xl">
              <Crown className="w-8 h-8 text-white" />
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-50 animate-pulse"></div>
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
            ✨ العروض الحصرية المميزة ✨
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
              <Zap className="w-5 h-5" />
              <span>عروض لفترة محدودة</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
              <Gift className="w-5 h-5" />
              <span>خصومات استثنائية</span>
            </div>
          </div>
          
          <p className="text-lg text-white/80 font-medium max-w-2xl mx-auto">
            🎯 اغتنم الفرصة واحصل على أفضل المنتجات بأسعار مذهلة 🎯
          </p>
        </div>

        {/* شبكة العروض الأنيقة */}
        <div className="space-y-8">
          {activeOffers.map((product: any, index: number) => {
            const originalPrice = product.price;
            const discountedPrice = originalPrice * (1 - product.offer.discount_percentage / 100);
            const savings = originalPrice - discountedPrice;
            
            return (
              <div 
                key={product.id} 
                className="group relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* هالة متوهجة */}
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                
                <Card className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl hover:shadow-[0_0_60px_rgba(168,85,247,0.3)] transition-all duration-500 hover:scale-[1.01]">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row min-h-[400px]">
                      {/* صورة المنتج */}
                      <div className="relative lg:w-80 h-64 lg:h-auto overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* تغطية تدرجية */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        
                        {/* شارة الخصم */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-black text-sm px-4 py-2 rounded-xl shadow-lg border-0">
                            🔥 خصم {product.offer.discount_percentage}%
                          </Badge>
                        </div>
                        
                        {/* التقييم */}
                        <div className="absolute bottom-4 right-4">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
                            <Star className="w-4 h-4 text-white fill-current" />
                            <span className="text-white font-bold text-sm">4.9</span>
                          </div>
                        </div>
                        
                        {/* شارة الأكثر مبيعاً */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white px-3 py-2 rounded-lg font-bold text-xs shadow-lg">
                            🏆 الأكثر مبيعاً
                          </div>
                        </div>
                      </div>
                      
                      {/* محتوى المنتج */}
                      <div className="flex-1 p-8 flex flex-col justify-between">
                        <div>
                          <h3 className="text-3xl font-black text-white mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                            {product.name}
                          </h3>
                          <p className="text-white/70 text-base leading-relaxed mb-6">
                            {product.description || '✨ منتج متميز بجودة عالية وسعر لا يُقاوم'}
                          </p>
                          
                          {/* مؤقت العرض */}
                          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-300/20 rounded-xl px-4 py-3 mb-6">
                            <div className="flex items-center gap-3 text-orange-200">
                              <Clock className="w-5 h-5" />
                              <span className="font-bold text-sm">
                                ⏰ ينتهي العرض: {new Date(product.offer.end_date).toLocaleDateString('ar-EG')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* الأسعار والإجراءات */}
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="text-lg text-white/50 line-through font-semibold">
                                {originalPrice.toFixed(2)} ج.م
                              </span>
                              <Badge className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-bold px-3 py-1 text-sm shadow-lg border-0">
                                💰 وفر {savings.toFixed(2)} ج.م
                              </Badge>
                            </div>
                            <div className="text-4xl font-black bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                              {discountedPrice.toFixed(2)} ج.م
                            </div>
                          </div>
                          
                          <button
                            onClick={() => addToCart({ ...product, price: discountedPrice })}
                            className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 
                                     text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]
                                     transition-all duration-300 flex items-center gap-3 justify-center
                                     hover:scale-105 transform group/btn"
                          >
                            <ShoppingCart className="w-6 h-6 group-hover/btn:animate-bounce" />
                            <span>🛍️ أضف إلى السلة</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
        
        {/* رسالة تشجيعية */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer">
            <Crown className="w-6 h-6 mr-3" />
            <span>🎯 لا تفوت هذه الفرصة الذهبية! 🎯</span>
            <Zap className="w-6 h-6 ml-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersSection;
