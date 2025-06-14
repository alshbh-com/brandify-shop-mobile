
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useOffers } from '@/hooks/useOffers';
import { Star, Clock, Tag, TrendingDown, ShoppingCart, Zap, Gift, Crown } from 'lucide-react';

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
    <div className="relative px-6 py-16 overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="2"/%3E%3Ccircle cx="27" cy="7" r="2"/%3E%3Ccircle cx="47" cy="7" r="2"/%3E%3Ccircle cx="7" cy="27" r="2"/%3E%3Ccircle cx="27" cy="27" r="2"/%3E%3Ccircle cx="47" cy="27" r="2"/%3E%3Ccircle cx="7" cy="47" r="2"/%3E%3Ccircle cx="27" cy="47" r="2"/%3E%3Ccircle cx="47" cy="47" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        {/* دوائر متحركة */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* المحتوى */}
      <div className="relative z-10">
        {/* عنوان القسم المذهل */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-60 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
          </div>
          
          <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
            ✨ العروض الذهبية الحصرية ✨
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold animate-bounce">
              <Zap className="w-5 h-5" />
              <span>عروض محدودة</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full font-bold animate-bounce delay-200">
              <Gift className="w-5 h-5" />
              <span>خصومات مذهلة</span>
            </div>
          </div>
          
          <p className="text-xl text-purple-100 font-medium max-w-2xl mx-auto leading-relaxed">
            🎉 اكتشف أفضل العروض والخصومات الاستثنائية التي لا تتكرر 🎉
          </p>
        </div>

        {/* شبكة العروض المذهلة */}
        <div className="space-y-12">
          {activeOffers.map((product: any, index: number) => {
            const originalPrice = product.price;
            const discountedPrice = originalPrice * (1 - product.offer.discount_percentage / 100);
            const savings = originalPrice - discountedPrice;
            
            return (
              <div 
                key={product.id} 
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* هالة متوهجة */}
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500 animate-pulse"></div>
                
                <Card className="relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hover:shadow-[0_0_80px_rgba(168,85,247,0.4)] transition-all duration-500 hover:scale-[1.02]">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* صورة المنتج المتطورة */}
                      <div className="relative lg:w-96 h-80 overflow-hidden rounded-3xl lg:rounded-r-none">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* تدرج فوق الصورة */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        
                        {/* شارة الخصم المتوهجة */}
                        <div className="absolute top-6 left-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur-lg opacity-80 animate-pulse"></div>
                            <Badge className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white font-black text-lg px-6 py-3 rounded-2xl shadow-2xl border-2 border-white/30">
                              🔥 خصم {product.offer.discount_percentage}% 🔥
                            </Badge>
                          </div>
                        </div>
                        
                        {/* التقييم المتوهج */}
                        <div className="absolute bottom-6 right-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-yellow-400 rounded-2xl blur-lg opacity-60"></div>
                            <div className="relative bg-gradient-to-r from-yellow-400 to-orange-400 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-2 border border-white/30">
                              <Star className="w-5 h-5 text-white fill-current animate-spin" />
                              <span className="text-white font-black text-lg">4.9</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* شارة "الأكثر مبيعاً" */}
                        <div className="absolute top-6 right-6">
                          <div className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg animate-bounce">
                            🏆 الأكثر مبيعاً
                          </div>
                        </div>
                      </div>
                      
                      {/* محتوى المنتج الفاخر */}
                      <div className="flex-1 p-10 bg-gradient-to-br from-white/10 to-white/5">
                        <div className="mb-8">
                          <h3 className="text-4xl font-black text-white mb-4 group-hover:bg-gradient-to-r group-hover:from-yellow-300 group-hover:to-pink-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                            {product.name}
                          </h3>
                          <p className="text-purple-100 text-lg leading-relaxed">
                            {product.description || '✨ منتج استثنائي بجودة عالمية وخصم لا يُقاوم ✨'}
                          </p>
                        </div>
                        
                        {/* مؤقت العرض المتوهج */}
                        <div className="relative mb-8">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-lg opacity-30"></div>
                          <div className="relative bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-300/30 rounded-2xl px-6 py-4">
                            <div className="flex items-center gap-3 text-orange-200">
                              <div className="relative">
                                <Clock className="w-6 h-6 animate-spin" />
                                <div className="absolute inset-0 bg-orange-400 rounded-full blur-md opacity-50"></div>
                              </div>
                              <span className="font-black text-lg">
                                ⏰ ينتهي العرض: {new Date(product.offer.end_date).toLocaleDateString('ar-EG')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* الأسعار والإجراءات الفاخرة */}
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <span className="text-2xl text-gray-300 line-through font-bold">
                                {originalPrice.toFixed(2)} ج.م
                              </span>
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur-lg opacity-60"></div>
                                <Badge className="relative bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-black px-4 py-2 text-lg shadow-lg border border-white/30">
                                  💰 وفر {savings.toFixed(2)} ج.م
                                </Badge>
                              </div>
                            </div>
                            <div className="relative">
                              <div className="text-5xl font-black bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
                                {discountedPrice.toFixed(2)} ج.م
                              </div>
                              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-xl blur-xl"></div>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
                            <button
                              onClick={() => addToCart({ ...product, price: discountedPrice })}
                              className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 
                                       text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]
                                       transition-all duration-300 flex items-center gap-4 justify-center border-2 border-white/30
                                       hover:scale-105 hover:rotate-1 transform"
                            >
                              <div className="relative">
                                <ShoppingCart className="w-7 h-7 animate-bounce" />
                                <div className="absolute inset-0 bg-white rounded-full blur-md opacity-30"></div>
                              </div>
                              <span className="relative">🛍️ أضف إلى السلة</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
        
        {/* رسالة تشجيعية مذهلة */}
        <div className="text-center mt-16">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white px-12 py-6 rounded-full font-black text-2xl shadow-2xl border-4 border-white/30 hover:scale-110 transition-transform duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <Crown className="w-8 h-8 animate-bounce" />
                <span>🎯 لا تفوت هذه الفرصة الذهبية! 🎯</span>
                <Zap className="w-8 h-8 animate-bounce delay-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersSection;
