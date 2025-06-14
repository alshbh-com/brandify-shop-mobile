
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
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 overflow-hidden">
      {/* خلفية هندسية متحركة */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-violet-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-cyan-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full filter blur-2xl animate-pulse delay-500"></div>
        
        {/* شبكة هندسية */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>
      </div>

      <div className="relative z-20 container mx-auto px-6 py-20">
        {/* العنوان الفاخر */}
        <div className="text-center mb-20">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-full mb-8">
              <Crown className="w-12 h-12 text-white mx-auto animate-bounce" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-8">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
              عروض حصرية
            </span>
          </h1>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 animate-pulse" />
              <span>عروض محدودة الوقت</span>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition-transform">
              <Gift className="w-6 h-6 animate-pulse" />
              <span>خصومات استثنائية</span>
            </div>
          </div>
          
          <p className="text-2xl text-slate-300 font-medium max-w-4xl mx-auto leading-relaxed">
            اكتشف مجموعة مختارة من أفضل العروض والخصومات الحصرية
          </p>
        </div>

        {/* بطاقات العروض الفاخرة */}
        <div className="grid gap-12 max-w-7xl mx-auto">
          {activeOffers.map((product: any, index: number) => {
            const originalPrice = product.price;
            const discountedPrice = originalPrice * (1 - product.offer.discount_percentage / 100);
            const savings = originalPrice - discountedPrice;
            
            return (
              <div 
                key={product.id}
                className="group relative"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                {/* هالة مضيئة */}
                <div className="absolute -inset-6 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-700"></div>
                
                <Card className="relative bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 group-hover:scale-[1.02]">
                  <CardContent className="p-0">
                    <div className="grid lg:grid-cols-2 gap-0 min-h-[500px]">
                      {/* قسم الصورة */}
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* تدرج فوق الصورة */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                        
                        {/* شارة الخصم */}
                        <div className="absolute top-8 left-8">
                          <div className="relative">
                            <div className="absolute inset-0 bg-red-500 rounded-2xl blur-lg opacity-80"></div>
                            <Badge className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white font-black text-xl px-6 py-3 rounded-2xl border-2 border-white/20">
                              خصم {product.offer.discount_percentage}%
                            </Badge>
                          </div>
                        </div>
                        
                        {/* التقييم */}
                        <div className="absolute bottom-8 right-8">
                          <div className="bg-yellow-500/90 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-2">
                            <Star className="w-5 h-5 text-white fill-current" />
                            <span className="text-white font-bold text-lg">4.9</span>
                          </div>
                        </div>
                        
                        {/* علامة "الأكثر مبيعاً" */}
                        <div className="absolute top-8 right-8">
                          <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                            الأكثر مبيعاً
                          </div>
                        </div>
                      </div>
                      
                      {/* قسم المحتوى */}
                      <div className="p-12 flex flex-col justify-between bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                        <div className="space-y-6">
                          <h2 className="text-4xl font-black text-white group-hover:text-yellow-300 transition-colors duration-300">
                            {product.name}
                          </h2>
                          
                          <p className="text-slate-300 text-lg leading-relaxed">
                            {product.description || 'منتج متميز بجودة عالية وأداء ممتاز'}
                          </p>
                          
                          {/* مؤقت العرض */}
                          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-300/30 rounded-2xl px-6 py-4">
                            <div className="flex items-center gap-3 text-orange-200">
                              <Clock className="w-6 h-6" />
                              <span className="font-bold text-lg">
                                ينتهي العرض: {new Date(product.offer.end_date).toLocaleDateString('ar-EG')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* الأسعار والزر */}
                        <div className="space-y-6 mt-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <span className="text-2xl text-slate-400 line-through font-semibold">
                                {originalPrice.toFixed(2)} ج.م
                              </span>
                              <Badge className="bg-emerald-500 text-white font-bold px-4 py-2 text-lg">
                                وفر {savings.toFixed(2)} ج.م
                              </Badge>
                            </div>
                            <div className="text-5xl font-black bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                              {discountedPrice.toFixed(2)} ج.م
                            </div>
                          </div>
                          
                          <button
                            onClick={() => addToCart({ ...product, price: discountedPrice })}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 
                                     text-white px-8 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/50
                                     transition-all duration-300 flex items-center justify-center gap-4
                                     hover:scale-105 transform group/btn"
                          >
                            <ShoppingCart className="w-7 h-7 group-hover/btn:animate-bounce" />
                            <span>أضف إلى السلة</span>
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
        
        {/* دعوة للعمل */}
        <div className="text-center mt-20">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full blur-2xl opacity-60"></div>
            <div className="relative bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white px-12 py-6 rounded-full font-black text-2xl hover:scale-110 transition-transform duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <Crown className="w-8 h-8" />
                <span>لا تفوت هذه الفرصة الذهبية!</span>
                <Zap className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
