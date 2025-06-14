
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useOffers } from '@/hooks/useOffers';
import { Star, Clock, Tag, TrendingDown, ShoppingCart } from 'lucide-react';

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
    <div className="px-6 py-12 bg-gradient-to-br from-slate-50 to-blue-50">
      {/* عنوان القسم */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">العروض المميزة</h2>
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
        </div>
        <p className="text-slate-600 text-lg">
          اكتشف أفضل العروض والخصومات الحصرية
        </p>
      </div>

      {/* شبكة العروض */}
      <div className="space-y-8">
        {activeOffers.map((product: any) => {
          const originalPrice = product.price;
          const discountedPrice = originalPrice * (1 - product.offer.discount_percentage / 100);
          const savings = originalPrice - discountedPrice;
          
          return (
            <Card key={product.id} className="offer-card premium-shadow animate-fade-in-up overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* صورة المنتج */}
                  <div className="relative lg:w-80 h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* شارة الخصم */}
                    <div className="absolute top-4 left-4">
                      <Badge className="special-offer-bg text-white font-bold text-sm px-3 py-2 rounded-full shadow-lg">
                        خصم {product.offer.discount_percentage}%
                      </Badge>
                    </div>
                    
                    {/* تقييم المنتج */}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-slate-700">4.8</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* محتوى المنتج */}
                  <div className="flex-1 p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">
                        {product.name}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {product.description || 'منتج عالي الجودة بخصم استثنائي'}
                      </p>
                    </div>
                    
                    {/* مؤقت العرض */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 mb-6">
                      <div className="flex items-center gap-2 text-orange-700">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          ينتهي العرض: {new Date(product.offer.end_date).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                    </div>
                    
                    {/* الأسعار والإجراءات */}
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg text-slate-400 line-through">
                            {originalPrice.toFixed(2)} ج.م
                          </span>
                          <Badge className="bg-green-100 text-green-700 font-semibold px-2 py-1">
                            وفر {savings.toFixed(2)} ج.م
                          </Badge>
                        </div>
                        <div className="text-3xl font-bold text-teal-600">
                          {discountedPrice.toFixed(2)} ج.م
                        </div>
                      </div>
                      
                      <button
                        onClick={() => addToCart({ ...product, price: discountedPrice })}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 
                                 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl 
                                 transition-all duration-200 flex items-center gap-3 justify-center"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        أضف إلى السلة
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* رسالة تشجيعية */}
      <div className="text-center mt-12">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-500 
                       text-white px-6 py-3 rounded-full font-semibold shadow-lg">
          <Star className="w-5 h-5" />
          <span>لا تفوت هذه العروض المحدودة!</span>
        </div>
      </div>
    </div>
  );
};

export default OffersSection;
