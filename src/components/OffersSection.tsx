
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useOffers } from '@/hooks/useOffers';
import { Star, Clock, ShoppingCart, Zap, Gift, Crown, Sparkles, TrendingUp, Fire } from 'lucide-react';

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
    <section className="relative px-6 py-16 overflow-hidden">
      {/* خلفية متحركة مذهلة */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(139,92,246,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.3)_0%,transparent_50%)]"></div>
      </div>

      {/* شبكة نجوم متلألئة */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* عنوان فائق الإبداع */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center animate-bounce">
                <Fire className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-5xl font-black bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mb-2">
                عروض خيالية
              </h2>
              <div className="flex items-center justify-center gap-2 text-yellow-300">
                <TrendingUp className="w-5 h-5 animate-bounce" />
                <span className="text-lg font-bold">خصومات تصل إلى 70%</span>
                <TrendingUp className="w-5 h-5 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '0.3s' }}>
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <p className="text-xl text-purple-100 font-semibold">
            🔥 لفترة محدودة جداً - لا تفوت الفرصة! 🔥
          </p>
        </div>

        {/* شبكة العروض المذهلة */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {activeOffers.map((product: any, index: number) => {
            const originalPrice = product.price;
            const discountedPrice = originalPrice * (1 - product.offer.discount_percentage / 100);
            const savings = originalPrice - discountedPrice;
            
            return (
              <div
                key={product.id}
                className="group relative transform transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* بطاقة فائقة الجمال */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border-2 border-white/20 shadow-2xl hover:shadow-purple-500/50 transition-all duration-500">
                  
                  {/* تأثير توهج عند التمرير */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
                  
                  <CardContent className="p-0 relative z-10">
                    {/* صورة المنتج مع تأثيرات */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* طبقة متدرجة */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      
                      {/* شارة الخصم المتوهجة */}
                      <div className="absolute top-4 left-4">
                        <div className="relative">
                          <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-black px-4 py-2 text-lg shadow-lg animate-pulse">
                            -{product.offer.discount_percentage}%
                          </Badge>
                          <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50 animate-ping"></div>
                        </div>
                      </div>
                      
                      {/* التقييم المتوهج */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                          <Star className="w-4 h-4 fill-current animate-spin" style={{ animationDuration: '3s' }} />
                          <span className="font-bold">4.9</span>
                        </div>
                      </div>
                      
                      {/* أيقونة العجلة */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Zap className="w-6 h-6 text-yellow-300 animate-bounce" />
                        </div>
                      </div>
                    </div>
                    
                    {/* محتوى البطاقة */}
                    <div className="p-6 bg-gradient-to-b from-white/10 to-white/5">
                      <h3 className="font-black text-xl text-white mb-3 group-hover:text-yellow-200 transition-colors">
                        {product.name}
                      </h3>
                      
                      {/* مؤقت العرض المميز */}
                      <div className="flex items-center gap-2 text-orange-300 text-sm mb-4 bg-black/20 rounded-lg p-2">
                        <Clock className="w-4 h-4 animate-pulse" />
                        <span className="font-bold">ينتهي: {new Date(product.offer.end_date).toLocaleDateString('ar-EG')}</span>
                        <div className="flex-1"></div>
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs animate-pulse">عاجل</span>
                      </div>
                      
                      {/* الأسعار المذهلة */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-3xl font-black text-green-400">
                            {discountedPrice.toFixed(2)} ج.م
                          </div>
                          <div className="text-right">
                            <div className="text-lg text-gray-300 line-through">
                              {originalPrice.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-400/30">
                          <div className="text-green-300 font-bold text-center">
                            💰 وفر {savings.toFixed(2)} ج.م 💰
                          </div>
                        </div>
                      </div>
                      
                      {/* زر الشراء الأسطوري */}
                      <button
                        onClick={() => addToCart({ ...product, price: discountedPrice })}
                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 
                                 text-white py-4 px-6 rounded-xl font-black text-lg flex items-center justify-center gap-3
                                 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105
                                 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <ShoppingCart className="w-6 h-6 animate-bounce" />
                        <span>اشتري الآن</span>
                        <Gift className="w-6 h-6 animate-pulse" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* تأثير الهالة */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            );
          })}
        </div>
        
        {/* رسالة تحفيزية مذهلة */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-xl text-white px-8 py-4 rounded-2xl font-black text-xl border-2 border-yellow-400/50 shadow-2xl hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 animate-spin text-yellow-300" />
            <span>⚡ عروض البرق - اطلب قبل نفاد الكمية! ⚡</span>
            <Fire className="w-6 h-6 animate-bounce text-red-400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
