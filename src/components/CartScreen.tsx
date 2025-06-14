
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CartScreen = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, user } = useApp();
  const { t } = useSettingsContext();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount_percent / 100) : 0;
  const total = subtotal - discount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('يرجى إدخال كود الخصم');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      // التحقق من وجود الكوبون وصحته
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim())
        .eq('is_active', true)
        .lte('start_date', new Date().toISOString().split('T')[0])
        .gte('end_date', new Date().toISOString().split('T')[0])
        .single();

      if (error || !coupon) {
        setCouponError('كود الخصم غير صحيح أو منتهي الصلاحية');
        return;
      }

      // التحقق من عدد مرات الاستخدام
      if (coupon.usage_count >= coupon.max_usage) {
        setCouponError('تم استنفاد عدد مرات استخدام هذا الكوبون');
        return;
      }

      // التحقق من استخدام المستخدم للكوبون من قبل
      if (user) {
        const { data: usage } = await supabase
          .from('coupon_usages')
          .select('*')
          .eq('user_id', user.id)
          .eq('coupon_id', coupon.code)
          .single();

        if (usage) {
          setCouponError('لقد استخدمت هذا الكوبون من قبل');
          return;
        }
      }

      setAppliedCoupon(coupon);
      setCouponError('');
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError('حدث خطأ أثناء تطبيق الكوبون');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }

    // تسجيل استخدام الكوبون إذا تم تطبيقه
    if (appliedCoupon) {
      try {
        // إضافة سجل استخدام الكوبون
        await supabase.from('coupon_usages').insert({
          user_id: user.id,
          coupon_id: appliedCoupon.code
        });

        // تحديث عدد مرات الاستخدام
        await supabase
          .from('coupons')
          .update({ usage_count: appliedCoupon.usage_count + 1 })
          .eq('id', appliedCoupon.id);
      } catch (error) {
        console.error('Error recording coupon usage:', error);
      }
    }

    // هنا يمكن إضافة منطق الدفع الفعلي
    alert(`تم تأكيد الطلب بمبلغ ${total.toFixed(2)} جنيه!`);
    clearCart();
    setAppliedCoupon(null);
    setCouponCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('emptyCart')}</h2>
          <p className="text-gray-500">{t('addItemsToCart')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('cart')}</h1>
      
      <div className="max-w-2xl mx-auto space-y-4">
        {cart.map((item) => (
          <Card key={item.id} className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-blue-600 font-semibold">{item.price} {t('currency')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Coupon Section */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={20} className="text-blue-500" />
              <h3 className="font-medium text-gray-800">كود الخصم</h3>
            </div>
            
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <Input
                  placeholder="أدخل كود الخصم"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={applyCoupon}
                  disabled={isApplyingCoupon}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isApplyingCoupon ? 'جاري التطبيق...' : 'تطبيق'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                <div>
                  <span className="font-medium text-green-800">تم تطبيق الكوبون: {appliedCoupon.code}</span>
                  <span className="text-green-600 block text-sm">خصم {appliedCoupon.discount_percent}%</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeCoupon}
                  className="text-red-500 hover:text-red-700"
                >
                  إزالة
                </Button>
              </div>
            )}
            
            {couponError && (
              <p className="text-red-500 text-sm mt-2">{couponError}</p>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">{t('orderSummary')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span>{subtotal.toFixed(2)} {t('currency')}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>الخصم ({appliedCoupon.discount_percent}%)</span>
                  <span>-{discount.toFixed(2)} {t('currency')}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>{t('total')}</span>
                <span className="text-blue-600">{total.toFixed(2)} {t('currency')}</span>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
              onClick={handleCheckout}
            >
              {t('checkout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartScreen;
